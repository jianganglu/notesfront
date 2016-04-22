define(['Animate'], function(animate) {
  function TabView() {
    this.name = 'TabView';
    this.animate = new animate();
  }

  return TabView;
})