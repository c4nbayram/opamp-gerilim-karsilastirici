function Header() {
  return (
    <header className="app-header">
      <div className="header-intro">
        <p className="course-label">Yazılım Projesi Geliştirme Dersi</p>
        <h1>Grup 18</h1>
        <p className="subtitle">Gerilim Karşılaştırıcı Simülatörü</p>
      </div>

      <img
        className="brand-logo"
        src="/logo.png"
        alt="İstanbul Topkapı Üniversitesi"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <div className="header-note">
        Op-amp karşılaştırıcı devresi, giriş gerilimini referans gerilimi ile karşılaştırarak
        çıkışını pozitif veya negatif doyum seviyesine taşır. Bu simülatör ideal op-amp
        karşılaştırıcı modeli temel alınarak hazırlanmıştır.
      </div>
    </header>
  );
}

export default Header;
