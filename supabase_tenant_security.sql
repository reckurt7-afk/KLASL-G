-- ====================================================================================
-- KLAS LİG MULTI-TENANT GÜVENLİK VE İZOLASYON POLİTİKALARI (RLS & TRIGGERS)
-- ====================================================================================
-- LÜTFEN BU KODUN TAMAMINI KOPYALAYIP SUPABASE SQL EDITOR'DE (NEW QUERY) ÇALIŞTIRIN.
-- Bu script, İstanbul admininin Bursa verilerini görmesini imkansız hale getirir.
-- ====================================================================================

-- 1. OTOMATİK ŞEHİR (TENANT) ATAMA FONKSİYONU
-- Admin panelinden yeni kayıt eklendiğinde, adminin şehrini otomatik olarak kayda işler.
CREATE OR REPLACE FUNCTION set_tenant_id()
RETURNS TRIGGER AS $$
DECLARE
  v_city_id INTEGER;
  v_role TEXT;
BEGIN
  -- Giriş yapan adminin rolünü ve şehrini bul
  SELECT role, city_id INTO v_role, v_city_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
  
  IF v_role = 'super_admin' THEN
    -- Super Admin istediği şehre kayıt girebilir, boş bırakırsa kendi şehrine atar
    IF NEW.city_id IS NULL THEN
      NEW.city_id := v_city_id; 
    END IF;
  ELSIF v_city_id IS NOT NULL THEN
    -- Şehir Admini (İstanbul) ise, ne yaparsa yapsın ZORLA İstanbul (id:2) atar.
    NEW.city_id := v_city_id; 
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TRİGGERLARI TABLOLARA UYGULA (Insert işlemi öncesi devreye girer)
DROP TRIGGER IF EXISTS trg_set_tenant_takimlar ON public.takimlar;
CREATE TRIGGER trg_set_tenant_takimlar BEFORE INSERT ON public.takimlar FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_oyuncular ON public.oyuncular;
CREATE TRIGGER trg_set_tenant_oyuncular BEFORE INSERT ON public.oyuncular FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_maclar ON public.maclar;
CREATE TRIGGER trg_set_tenant_maclar BEFORE INSERT ON public.maclar FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DROP TRIGGER IF EXISTS trg_set_tenant_duyurular ON public.duyurular;
CREATE TRIGGER trg_set_tenant_duyurular BEFORE INSERT ON public.duyurular FOR EACH ROW EXECUTE FUNCTION set_tenant_id();

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'hakemler') THEN
        DROP TRIGGER IF EXISTS trg_set_tenant_hakemler ON public.hakemler;
        CREATE TRIGGER trg_set_tenant_hakemler BEFORE INSERT ON public.hakemler FOR EACH ROW EXECUTE FUNCTION set_tenant_id();
    END IF;
END $$;


-- 3. ROW LEVEL SECURITY (RLS) İZOLASYON POLİTİKALARI
-- Tabloların güvenliğini aktif et
ALTER TABLE public.takimlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oyuncular ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maclar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duyurular ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF EXISTS (SELECT FROM pg_tables WHERE tablename='hakemler') THEN ALTER TABLE public.hakemler ENABLE ROW LEVEL SECURITY; END IF; END $$;

-- RLS Helper Fonksiyonu (Okuma kolaylığı için)
CREATE OR REPLACE FUNCTION current_user_city_id() RETURNS INTEGER AS $$
  SELECT city_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin');
$$ LANGUAGE sql STABLE;

-- TAKIMLAR TABLOSU POLİTİKALARI
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.takimlar;
CREATE POLICY "tenant_isolation_policy" ON public.takimlar
AS PERMISSIVE FOR ALL
USING (
  -- Herkes (anonim) dışarıdan okuyabilir (Frontend kendi filtreler)
  auth.uid() IS NULL 
  OR 
  -- Giriş yapan admin sadece kendi şehrini görür/değiştirir
  city_id = current_user_city_id()
  OR
  -- Super admin her şeyi görür/değiştirir
  is_super_admin()
);

-- OYUNCULAR TABLOSU POLİTİKALARI
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.oyuncular;
CREATE POLICY "tenant_isolation_policy" ON public.oyuncular
AS PERMISSIVE FOR ALL
USING ( auth.uid() IS NULL OR city_id = current_user_city_id() OR is_super_admin() );

-- MAÇLAR TABLOSU POLİTİKALARI
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.maclar;
CREATE POLICY "tenant_isolation_policy" ON public.maclar
AS PERMISSIVE FOR ALL
USING ( auth.uid() IS NULL OR city_id = current_user_city_id() OR is_super_admin() );

-- DUYURULAR TABLOSU POLİTİKALARI
DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.duyurular;
CREATE POLICY "tenant_isolation_policy" ON public.duyurular
AS PERMISSIVE FOR ALL
USING ( auth.uid() IS NULL OR city_id = current_user_city_id() OR is_super_admin() );

-- HAKEMLER TABLOSU POLİTİKALARI
DO $$ BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE tablename='hakemler') THEN 
    DROP POLICY IF EXISTS "tenant_isolation_policy" ON public.hakemler;
    CREATE POLICY "tenant_isolation_policy" ON public.hakemler
    AS PERMISSIVE FOR ALL
    USING ( auth.uid() IS NULL OR city_id = current_user_city_id() OR is_super_admin() );
  END IF; 
END $$;
