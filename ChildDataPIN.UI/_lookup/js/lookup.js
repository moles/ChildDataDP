Ext.onReady(function () {

  //This component doesn't has the same behavior, it's a viewport 	
  var lookup = new Ext.Viewport({
    width: "100%",
    loadMask: true,
    collapsible: true,
    animCollapse: true,
    layout: 'fit',
    items: [
		    {
		      layout: 'fit',
		      bbar: [
			    {
			      text: 'Ok',
			      tooltip: 'Select the current record',
			      icon: "../resources/images/application/ok.png",
			      cls: 'x-btn-text-icon',
			      handler: select
			    },
			    {
			      text: 'Cancel',
			      tooltip: 'Close this window',
			      icon: "../resources/images/application/cancel.png",
			      cls: 'x-btn-text-icon',
			      handler: function() {
			        window.close();
			      }
}],
		      items: lookupGrid
}]
  });

  lookupGrid.on('dblClick', select);

  function select() {
    var record = lookupGrid.getSelectionModel().getSelected();

    if (record != null) {
      window.returnValue = record.data;
      window.close();
    }
    else
      alert('Please select a row.');

  }
});