"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const inputStyle = {
  width: "100%",
  background: "#ffffff",
  border: "1px solid #cccccc",
  borderRadius: 12,
  padding: "14px 16px",
  color: "#1a1a1a",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block" as const,
  color: "#666666",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

export default function KayitPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    tc: "",
    ad: "",
    soyad: "",
    email: "",
    phone: "",
    dogumTarihi: "",
    sifre: "",
    sifreTekrar: "",
    il: "Bursa",
    ilce: "",
    boy: "",
    kilo: "",
    ayakkabi: "",
    mevkii: "",
    sirtNo: "",
  });

  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState(false);

  function degistir(alan: keyof typeof form, deger: string) {
    setForm({ ...form, [alan]: deger });
  }

  async function kayitOl(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setBasarili(false);

    if (!sozlesmeOnay) {
      setHata("Sözleşmeyi onaylamadan kayıt olamazsınız.");
      return;
    }

    if (form.tc.trim().length !== 11) {
      setHata("TC Kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    if (form.ad.trim().length < 2 || form.soyad.trim().length < 2) {
      setHata("Ad ve soyad geçerli olmalıdır.");
      return;
    }

    const telefonTemiz = form.phone.replace(/\s/g, "");
    if (!/^(05|5)\d{9}$/.test(telefonTemiz)) {
      setHata("Geçerli bir telefon numarası girin. (05XXXXXXXXX)");
      return;
    }

    if (form.sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (form.sifre !== form.sifreTekrar) {
      setHata("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    const { data: varMi } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", telefonTemiz)
      .maybeSingle();

    if (varMi) {
      setHata("Bu telefon numarası ile zaten bir hesap açılmış. Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    const full_name = `${form.ad.trim()} ${form.soyad.trim()}`;

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.sifre,
      options: {
        data: {
          full_name: full_name,
          phone: telefonTemiz,
          tc_kimlik: form.tc.trim(),
          ad: form.ad.trim(),
          soyad: form.soyad.trim(),
          dogum_tarihi: form.dogumTarihi,
          il: form.il,
          ilce: form.ilce,
          boy: form.boy,
          kilo: form.kilo,
          ayakkabi: form.ayakkabi,
          mevkii: form.mevkii,
          sirt_no: form.sirtNo
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        setHata("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.");
      } else {
        setHata(error.message);
      }
      setLoading(false);
      return;
    }

    setBasarili(true);
    setLoading(false);
    
    setTimeout(() => {
      router.push("/lig");
    }, 2000);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
    }}>
      <div style={{ width: "100%", maxWidth: 800, position: "relative", zIndex: 1 }}>
        {/* Logo Bölümü */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 15px" }}>
            <Image
              src="/icons/logo.png"
              alt="KLAS LİG"
              fill
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}
            />
          </div>
          <h1 style={{
            color: "#1a1a1a",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 4,
            margin: 0,
            lineHeight: 1,
          }}>KLAS LİG</h1>
        </div>

        {/* Kart */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #eaeaea",
          borderRadius: 24,
          padding: "36px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
        }}>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <h2 style={{ color: "#1a1a1a", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>
              Profesyonel Oyuncu Kaydı ⚽
            </h2>
            <p style={{ color: "#666666", fontSize: 14, margin: 0 }}>
              Ligde yer almak için profilini eksiksiz oluştur. (Profil fotoğrafını kayıt olduktan sonra panelinden yükleyebilirsin.)
            </p>
          </div>

          {hata && (
            <div style={{
              background: "rgba(255,49,49,0.08)", border: "1px solid rgba(255,49,49,0.3)",
              borderRadius: 12, padding: "14px 18px", color: "#e60000", fontSize: 14, fontWeight: 600, marginBottom: 24,
            }}>
              🚨 {hata}
            </div>
          )}

          {basarili && (
            <div style={{
              background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)",
              borderRadius: 12, padding: "14px 18px", color: "#16a34a", fontSize: 14, fontWeight: 700, marginBottom: 24,
            }}>
              ✅ Kayıt başarılı! Lige yönlendiriliyorsunuz...
            </div>
          )}

          <form onSubmit={kayitOl}>
            
            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              
              <div className="md:col-span-2">
                <label style={labelStyle}>TC Kimlik No</label>
                <input type="text" maxLength={11} required placeholder="11 haneli TC Kimlik numaranız" value={form.tc} onChange={(e) => degistir("tc", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Ad</label>
                <input type="text" required placeholder="Adınız" value={form.ad} onChange={(e) => degistir("ad", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Soyad</label>
                <input type="text" required placeholder="Soyadınız" value={form.soyad} onChange={(e) => degistir("soyad", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>E-posta</label>
                <input type="email" required placeholder="E-posta adresiniz" value={form.email} onChange={(e) => degistir("email", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" required placeholder="05XXXXXXXXX" value={form.phone} onChange={(e) => degistir("phone", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Doğum Tarihi</label>
                <input type="date" required value={form.dogumTarihi} onChange={(e) => degistir("dogumTarihi", e.target.value)} style={inputStyle} />
              </div>
              
              <div>
                <label style={labelStyle}>Mevkii</label>
                <select required value={form.mevkii} onChange={(e) => degistir("mevkii", e.target.value)} style={inputStyle}>
                  <option value="">Seçiniz</option>
                  <option value="Kaleci">Kaleci</option>
                  <option value="Defans">Defans</option>
                  <option value="Orta Saha">Orta Saha</option>
                  <option value="Forvet">Forvet</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Boy (cm)</label>
                <input type="number" placeholder="Örn: 180" value={form.boy} onChange={(e) => degistir("boy", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Kilo (kg)</label>
                <input type="number" placeholder="Örn: 75" value={form.kilo} onChange={(e) => degistir("kilo", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Ayakkabı Numarası</label>
                <input type="number" placeholder="Örn: 42" value={form.ayakkabi} onChange={(e) => degistir("ayakkabi", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Sırt Numarası</label>
                <input type="number" placeholder="Örn: 10" value={form.sirtNo} onChange={(e) => degistir("sirtNo", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Yaşadığınız İl</label>
                <select required value={form.il} onChange={(e) => degistir("il", e.target.value)} style={inputStyle}>
                  <option value="">Seçiniz</option>
                  <option value="Adana">Adana</option>
                  <option value="Adıyaman">Adıyaman</option>
                  <option value="Afyonkarahisar">Afyonkarahisar</option>
                  <option value="Ağrı">Ağrı</option>
                  <option value="Amasya">Amasya</option>
                  <option value="Ankara">Ankara</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Artvin">Artvin</option>
                  <option value="Aydın">Aydın</option>
                  <option value="Balıkesir">Balıkesir</option>
                  <option value="Bilecik">Bilecik</option>
                  <option value="Bingöl">Bingöl</option>
                  <option value="Bitlis">Bitlis</option>
                  <option value="Bolu">Bolu</option>
                  <option value="Burdur">Burdur</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Çanakkale">Çanakkale</option>
                  <option value="Çankırı">Çankırı</option>
                  <option value="Çorum">Çorum</option>
                  <option value="Denizli">Denizli</option>
                  <option value="Diyarbakır">Diyarbakır</option>
                  <option value="Edirne">Edirne</option>
                  <option value="Elazığ">Elazığ</option>
                  <option value="Erzincan">Erzincan</option>
                  <option value="Erzurum">Erzurum</option>
                  <option value="Eskişehir">Eskişehir</option>
                  <option value="Gaziantep">Gaziantep</option>
                  <option value="Giresun">Giresun</option>
                  <option value="Gümüşhane">Gümüşhane</option>
                  <option value="Hakkari">Hakkari</option>
                  <option value="Hatay">Hatay</option>
                  <option value="Isparta">Isparta</option>
                  <option value="Mersin">Mersin</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Kars">Kars</option>
                  <option value="Kastamonu">Kastamonu</option>
                  <option value="Kayseri">Kayseri</option>
                  <option value="Kırklareli">Kırklareli</option>
                  <option value="Kırşehir">Kırşehir</option>
                  <option value="Kocaeli">Kocaeli</option>
                  <option value="Konya">Konya</option>
                  <option value="Kütahya">Kütahya</option>
                  <option value="Malatya">Malatya</option>
                  <option value="Manisa">Manisa</option>
                  <option value="Kahramanmaraş">Kahramanmaraş</option>
                  <option value="Mardin">Mardin</option>
                  <option value="Muğla">Muğla</option>
                  <option value="Muş">Muş</option>
                  <option value="Nevşehir">Nevşehir</option>
                  <option value="Niğde">Niğde</option>
                  <option value="Ordu">Ordu</option>
                  <option value="Rize">Rize</option>
                  <option value="Sakarya">Sakarya</option>
                  <option value="Samsun">Samsun</option>
                  <option value="Siirt">Siirt</option>
                  <option value="Sinop">Sinop</option>
                  <option value="Sivas">Sivas</option>
                  <option value="Tekirdağ">Tekirdağ</option>
                  <option value="Tokat">Tokat</option>
                  <option value="Trabzon">Trabzon</option>
                  <option value="Tunceli">Tunceli</option>
                  <option value="Şanlıurfa">Şanlıurfa</option>
                  <option value="Uşak">Uşak</option>
                  <option value="Van">Van</option>
                  <option value="Yozgat">Yozgat</option>
                  <option value="Zonguldak">Zonguldak</option>
                  <option value="Aksaray">Aksaray</option>
                  <option value="Bayburt">Bayburt</option>
                  <option value="Karaman">Karaman</option>
                  <option value="Kırıkkale">Kırıkkale</option>
                  <option value="Batman">Batman</option>
                  <option value="Şırnak">Şırnak</option>
                  <option value="Bartın">Bartın</option>
                  <option value="Ardahan">Ardahan</option>
                  <option value="Iğdır">Iğdır</option>
                  <option value="Yalova">Yalova</option>
                  <option value="Karabük">Karabük</option>
                  <option value="Kilis">Kilis</option>
                  <option value="Osmaniye">Osmaniye</option>
                  <option value="Düzce">Düzce</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>İlçe</label>
                <input type="text" required placeholder="İlçe adını yazınız" value={form.ilce} onChange={(e) => degistir("ilce", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Şifre</label>
                <input type="password" required placeholder="En az 6 karakter" value={form.sifre} onChange={(e) => degistir("sifre", e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Şifre (Tekrar)</label>
                <input type="password" required placeholder="Şifrenizi tekrar yazınız" value={form.sifreTekrar} onChange={(e) => degistir("sifreTekrar", e.target.value)} style={inputStyle} />
              </div>

            </div>

            {/* SÖZLEŞME ALANI */}
            <div className="mb-6">
              <label style={labelStyle} className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#e60000]" />
                Üyelik Bilgilendirmesi ve Sorumluluk Beyanı
              </label>
              <div className="h-48 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-5 text-[12px] text-gray-700 leading-relaxed font-medium mb-3 shadow-inner">
                <p className="mb-3 font-bold text-gray-900 text-[13px]">Tüm alanların eksiksiz ve doğru şekilde doldurulması zorunludur.</p>
                <p className="mb-3">Kayıt işlemi sırasında beyan edilen Ad, Soyad, T.C. Kimlik Numarası ve Doğum Tarihi bilgilerinin doğruluğu tamamen kullanıcı sorumluluğundadır.</p>
                <p className="mb-3">Yanlış, eksik veya gerçeğe aykırı bilgi verilmesi durumunda doğabilecek her türlü hukuki, idari ve mali sorumluluk kayıt yapan kullanıcıya aittir.</p>
                <p className="mb-3">Sistem güvenliği ve hesap doğrulaması amacıyla, kayıt sırasında belirtilen telefon numarasına aktivasyon kodu gönderilecektir.</p>
                
                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">TANIMLAR:</h4>
                <p className="mb-2"><strong>Şirket:</strong> TOPMOND EVENTS Organizasyon isimli firma işbu sözleşme kapsamında bu isim ile anılacaktır.</p>
                <p className="mb-2"><strong>Üye:</strong> Klas Lig'e kayıt formu doldurarak kayıt olan kişiler işbu sözleşme kapsamında bu isimle anılacaktır.</p>
                <p className="mb-2"><strong>Lig:</strong> İşbu sözleşme kapsamında Klas Lig bu isim ile anılacaktır.</p>
                <p className="mb-2"><strong>Hizmet:</strong> İşbu sözleşme kapsamında sağlanacak; bir spor tesisinin bir bölümünün tahsis edilmesi, fotoğraf/video çekimi, istatistiksel verilerin toplanması ve yayımlanması.</p>
                
                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">1. GENEL HÜKÜMLER</h4>
                <p className="mb-2">1.1. İnternet Sitesine girerek Lige üye olan herkes işbu sözleşme ile belirlenen koşulları kabul etmekle yükümlüdür.</p>
                <p className="mb-2">1.2. Sağlanan hizmet gereği; hizmeti alan tüm kişiler kişisel verilerin korunması kanunu kapsamında bildirdiği bilgilerin saklanmasına, işlenmesine ve yayımına işbu sözleşmenin onaylanması ile izin vermiş olmaktadır.</p>
                
                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">2. KATILIM ŞARTLARI VE SAĞLIK BEYANI</h4>
                <p className="mb-2">2.1. Lige üye olabilecek kişiler 16 yaşını doldurmuş olmalıdır.</p>
                <p className="mb-2">2.3. İşbu sözleşmeyi onaylayan herkes futbol müsabakalarına katılmaya engel sağlık sorununun olmadığını beyan etmiş olur. Sağlık sorunlarından kaynaklı zararlardan şirketin herhangi bir sorumluluğu bulunmamaktadır.</p>
                <p className="mb-2">2.4. 50 yaşından büyük üyelerin aktif katılımı için sağlık raporu ibraz etmeleri gerekebilir.</p>

                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">3. GÜVENLİK VE SORUMLULUK REDDİ</h4>
                <p className="mb-2">3.3. Yaralanma, kavga, sakatlanma gibi hukuki veya cezai sonuçları bulunan hallerde organizasyonun herhangi bir sorumluluğu yoktur.</p>

                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">4. KVKK AYDINLATMA METNİ</h4>
                <p className="mb-2">Girdiğiniz veriler, ligin sportif faaliyetlerinin yürütülmesi, istatistiklerin tutulması ve internet sitemizde yayımlanması amacıyla işlenmektedir. Verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla ticari amaçla paylaşılmaz.</p>
                
                <h4 className="font-black text-gray-900 mt-5 mb-2 uppercase tracking-wide">7. SPORDA ŞİDDET YASASI</h4>
                <p>5149 Sayılı Kanun gereği sahada ve saha dışında yaşanacak her türlü şiddet ve düzensizlikten eylemi gerçekleştiren oyuncu, takım veya taraftar hukuken bizzat sorumludur.</p>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <input 
                  type="checkbox" 
                  checked={sozlesmeOnay} 
                  onChange={(e) => setSozlesmeOnay(e.target.checked)} 
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#e60000] focus:ring-[#e60000]"
                />
                <div>
                  <span className="block font-bold text-[13px] text-gray-800 group-hover:text-black">
                    Üyelik sözleşmesini okudum ve onaylıyorum.
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    (Sözleşmeyi onaylamadan kayıt olamazsınız)
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || basarili}
              style={{
                width: "100%",
                padding: "18px",
                background: (loading || basarili) ? "#f87171" : "#e60000",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: 2,
                cursor: (loading || basarili) ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "KAYIT YAPILIYOR..." : basarili ? "BAŞARILI!" : "KAYIT OL 🚀"}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid #eaeaea",
            textAlign: "center",
          }}>
            <p style={{ color: "#666666", fontSize: 15, margin: 0 }}>
              Zaten hesabın var mı?{" "}
              <Link href="/giris" style={{
                color: "#e60000",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: 15,
              }}>
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
