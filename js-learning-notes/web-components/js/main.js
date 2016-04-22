require(['tabview', 'treeview'], function(tabview, treeview) {
  var tabview = new tabview();
  var treeview = new treeview();

  console.log(tabview.name);
  console.log(tabview.animate.name);
  console.log(treeview.name);
});