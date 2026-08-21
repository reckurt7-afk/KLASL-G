-- 1. Add city_id to mac_olaylari and set default
ALTER TABLE public.mac_olaylari ADD COLUMN IF NOT EXISTS city_id INT DEFAULT 1;

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_mac_olaylari_city_id ON public.mac_olaylari(city_id);

-- 3. Enable RLS
ALTER TABLE public.mac_olaylari ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for tenant isolation
DROP POLICY IF EXISTS "tenant_isolation_mac_olaylari" ON public.mac_olaylari;
CREATE POLICY "tenant_isolation_mac_olaylari" ON public.mac_olaylari
    FOR ALL
    USING (
        city_id = (SELECT admin_city_id FROM public.user_roles WHERE user_id = auth.uid())
        OR 
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
    );

-- 5. Attach the set_tenant_id trigger so admins automatically insert into their own city
DROP TRIGGER IF EXISTS trigger_set_tenant_mac_olaylari ON public.mac_olaylari;
CREATE TRIGGER trigger_set_tenant_mac_olaylari
    BEFORE INSERT ON public.mac_olaylari
    FOR EACH ROW
    EXECUTE FUNCTION public.set_tenant_id();


-- ==========================================
-- STATS AUTOMATION TRIGGERS
-- ==========================================

-- Trigger Function: Update Oyuncular Stats on Mac Olayi Insert/Delete
CREATE OR REPLACE FUNCTION update_player_stats_from_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF (TG_OP = 'INSERT') THEN
        IF NEW.tip = 'GOL' THEN
            UPDATE public.oyuncular SET gol = COALESCE(gol, 0) + 1 WHERE ad_soyad = NEW.oyuncu AND city_id = NEW.city_id;
        ELSIF NEW.tip = 'ASIST' THEN
            UPDATE public.oyuncular SET asist = COALESCE(asist, 0) + 1 WHERE ad_soyad = NEW.oyuncu AND city_id = NEW.city_id;
        END IF;
        RETURN NEW;
    
    -- Handle DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.tip = 'GOL' THEN
            UPDATE public.oyuncular SET gol = GREATEST(COALESCE(gol, 0) - 1, 0) WHERE ad_soyad = OLD.oyuncu AND city_id = OLD.city_id;
        ELSIF OLD.tip = 'ASIST' THEN
            UPDATE public.oyuncular SET asist = GREATEST(COALESCE(asist, 0) - 1, 0) WHERE ad_soyad = OLD.oyuncu AND city_id = OLD.city_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to mac_olaylari
DROP TRIGGER IF EXISTS trigger_update_player_stats ON public.mac_olaylari;
CREATE TRIGGER trigger_update_player_stats
    AFTER INSERT OR DELETE ON public.mac_olaylari
    FOR EACH ROW
    EXECUTE FUNCTION update_player_stats_from_events();
