/**
 * landscape-guard.js
 * Menampilkan overlay "Putar HP" saat perangkat mobile di mode portrait.
 * Hanya aktif untuk perangkat sentuh / mobile sesungguhnya.
 */
(function () {
  var overlay = document.createElement('div');
  overlay.id = 'landscape-guard-overlay';
  overlay.innerHTML = [
    '<div class="lg-wrap">',
    '  <div class="lg-phone">📱</div>',
    '  <div class="lg-arrow">↻</div>',
    '  <p>Putar HP ke mode <strong>Landscape</strong><br>untuk tampilan terbaik!</p>',
    '</div>'
  ].join('');

  var style = document.createElement('style');
  style.textContent = '\
#landscape-guard-overlay {\
  display: none;\
  position: fixed;\
  inset: 0;\
  z-index: 99999;\
  background: linear-gradient(135deg, #0a0a1e 0%, #1a1a2e 100%);\
  color: #fff;\
  align-items: center;\
  justify-content: center;\
  font-family: "Baloo 2", sans-serif;\
}\
#landscape-guard-overlay .lg-wrap {\
  display: flex;\
  flex-direction: column;\
  align-items: center;\
  gap: 14px;\
  text-align: center;\
  padding: 30px;\
}\
#landscape-guard-overlay .lg-phone {\
  font-size: 60px;\
  animation: lgTilt 2s ease-in-out infinite;\
}\
#landscape-guard-overlay .lg-arrow {\
  font-size: 40px;\
  font-weight: 900;\
  color: #4da3ff;\
  animation: lgSpin 2s ease-in-out infinite;\
}\
#landscape-guard-overlay p {\
  font-size: 17px;\
  font-weight: 700;\
  color: rgba(255,255,255,0.88);\
  line-height: 1.65;\
  max-width: 280px;\
}\
#landscape-guard-overlay strong { color: #5bc8f5; }\
@keyframes lgTilt {\
  0%,100% { transform: rotate(0deg); }\
  40%,60% { transform: rotate(-90deg); }\
}\
@keyframes lgSpin {\
  0%,100% { transform: translateY(0) rotate(0deg); }\
  50% { transform: translateY(-6px) rotate(-20deg); }\
}';

  /* Deteksi mobile sungguhan: cek user-agent DAN pointer coarse */
  /* Deteksi mobile sungguhan: cek user-agent DAN pointer coarse */
  function isMobileDevice() {
    var ua = navigator.userAgent;
    var mobileUA = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    var tabletUA = /iPad|Tablet/i.test(ua);
    
    /* pointer: coarse = layar sentuh (HP/Tablet) */
    var touchPointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    
    /* Gunakan innerWidth/innerHeight atau matchMedia untuk deteksi ukuran, jauh lebih aman untuk PWA */
    var isSmallMedia = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var currentWidth = Math.min(window.innerWidth, window.screen.width);
    var narrowScreen = isSmallMedia || currentWidth <= 1024;
    
    /* Deteksi jika dibuka sebagai PWA Standalone */
    var isPWA = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    // Jika ini PWA, atau memenuhi kriteria mobile, anggap True
    return isPWA || ((mobileUA || tabletUA || touchPointer) && narrowScreen);
  }

  function check() {
    if (!isMobileDevice()) {
      overlay.style.display = 'none';
      return;
    }
    var portrait = window.innerHeight > window.innerWidth;
    overlay.style.display = portrait ? 'flex' : 'none';
  }

  /* Inject setelah DOM siap */
  function init() {
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    check();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', function () {
    setTimeout(check, 300);
  });
})();
