<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="plugin.aspx.cs" Inherits="ChildDataPIN.Web.Catalogo.plugin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
<link rel="stylesheet" type="text/css" href="../lib/flexigrid/css/flexigrid/flexigrid.css">
<script type="text/javascript" src="../Scripts/jquery-1.4.1.min.js"></script>
<script type="text/javascript" src="../lib/flexigrid/flexigrid.js"></script>
<script type="text/javascript">

    $("#flex1").flexigrid
			(
			{
			    url: '../catalogo/svc/CatalogoSVC.svc/RetrieveMultiple',
			    dataType: 'json',
			    colModel: [
				{ display: 'Descripcion', name: 'nombre', width: 40, sortable: true, align: 'center' },
				{ display: 'Codigo', name: 'codigo', width: 180, sortable: true, align: 'left' }
				],
			    buttons: [
				{ name: 'Add', bclass: 'add', onpress: test },
				{ name: 'Delete', bclass: 'delete', onpress: test },
				{ separator: true }
				],
			    searchitems: [
				{ display: 'Descripcion', name: 'nombre' },
				{ display: 'Codigo', name: 'codigo', isdefault: true }
				],
			    sortname: "nombre",
			    sortorder: "asc",
			    usepager: true,
			    title: 'Catalogo',
			    useRp: true,
			    rp: 15,
			    showTableToggleBtn: true,
			    width: 700,
			    height: 200
			}
			);

    function test(com, grid) {
        if (com == 'Delete') {
            confirm('Delete ' + $('.trSelected', grid).length + ' items?')
        }
        else if (com == 'Add') {
            alert('Add New Item');
        }
    }


    $('b.top').click
		(
			function () {
			    $(this).parent().toggleClass('fh');
			}
		);
	
</script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <table id="flex1" style="display:none"></table>
    </div>
    </form>
</body>
</html>
