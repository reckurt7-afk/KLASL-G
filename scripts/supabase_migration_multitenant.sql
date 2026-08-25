-- ====================================================================================
-- KLAS LİG MULTI-TENANT MİMARİSİ (SaaS) SQL MIGRATION SCRIPT
-- ====================================================================================
-- LÜTFEN BU KODUN TAMAMINI KOPYALAYIP SUPABASE SQL EDITOR'DE (NEW QUERY) ÇALIŞTIRIN.
-- ====================================================================================

-- 1. CITIES (ŞEHİRLER / TENANTS) TABLOSU OLUŞTUR VEYA GÜNCELLE
CREATE TABLE IF NOT EXISTS public.cities (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    code TEXT,
    logo_url TEXT,
    cover_url TEXT,
    domain TEXT,
    status TEXT DEFAULT 'AKTIF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bursa'yı varsayılan merkez (ana) şehir olarak ekle
INSERT INTO public.cities (id, name, slug, code, status) 
VALUES ('bursa', 'KLAS LİG BURSA', 'bursa', '16', 'AKTIF')
ON CONFLICT (id) DO NOTHING;

-- 2. LİSANS VE YÖNETİCİ ROLLERİ TABLOLARI
CREATE TABLE IF NOT EXISTS public.city_licenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    city_id TEXT REFERENCES public.cities(id),
    license_number TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'AKTIF',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    city_id TEXT REFERENCES public.cities(id),
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'city_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, city_id)
);

-- 3. MEVCUT TABLOLARA (TENANT) CITY_ID EKLENMESİ VE VARSAYILAN ATANMASI
-- Mevcut hiçbir veriniz SİLİNMEYECEKTİR. Hepsi Bursa şehrine bağlanacaktır.

-- Takımlar
ALTER TABLE public.takimlar ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
UPDATE public.takimlar SET city_id = 'bursa' WHERE city_id IS NULL;

-- Oyuncular
ALTER TABLE public.oyuncular ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
UPDATE public.oyuncular SET city_id = 'bursa' WHERE city_id IS NULL;

-- Maçlar
ALTER TABLE public.maclar ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
UPDATE public.maclar SET city_id = 'bursa' WHERE city_id IS NULL;

-- Duyurular (Haberler & KAP)
ALTER TABLE public.duyurular ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
UPDATE public.duyurular SET city_id = 'bursa' WHERE city_id IS NULL;

-- Hakemler (Eğer tablo varsa)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'hakemler') THEN
        ALTER TABLE public.hakemler ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
        UPDATE public.hakemler SET city_id = 'bursa' WHERE city_id IS NULL;
    END IF;
END $$;

-- Ayarlar (Eğer tablo varsa)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'ayarlar') THEN
        ALTER TABLE public.ayarlar ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES public.cities(id) DEFAULT 'bursa';
        UPDATE public.ayarlar SET city_id = 'bursa' WHERE city_id IS NULL;
    END IF;
END $$;

-- 4. SUPER ADMIN ATAMASI
-- Recep Şentürk e-posta adresi için otomatik super_admin ataması (Kullanıcı bulunduysa)
INSERT INTO public.user_roles (user_id, city_id, role)
SELECT id, 'bursa', 'super_admin'
FROM auth.users 
WHERE email = 'reckurt7@gmail.com'
ON CONFLICT (user_id, city_id) DO NOTHING;
