﻿(function () {
    var entityService = '../catalogo/svc/CatalogoSVC.svc';
    var url = entityService + '/TraerMultiples';
    
    //TODO: do this with the status on the entities
    var StatusEnum =
    {
        Active: '1',
        Inactive: '2'
    }

    var idProperty = 'id';

    var fields = [
    { name: 'id' },
{ name: 'nombre' },
{ name: 'codigo' },
{ name: 'activo' },
{ name: 'regpor' },
{ name: 'regen' },
{ name: 'regel' },
{ name: 'actel' },
{ name: 'actpor' },
{ name: 'acten' }
];

    var dsCatalogoService = new Ext.data.JsonStore(
    {
        url: url,
        root: 'data',
        totalProperty: 'totalCount',
        id: idProperty,
        fields: fields,
        remoteSort: true,
        sortInfo:
        {
            field: "nombre",
            direction: "ASC"
        }
    });

    dsCatalogoService.on("beforeload", assignBaseParams);

    /**
    * paramName: Es el parametro que se define en el webservice para realizar la busqueda.
    */
    var search = new Ext.ux.form.SearchField(
    {
        paramName: 'search',
        store: dsCatalogoService,
        width: 320
    });

    var paging = new Ext.PagingToolbar(
    {
        store: dsCatalogoService,
        displayInfo: true,
        pageSize: 20
    });

    loadDataSource();

    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
    {
        header: 'Descripcion',
        dataIndex: 'nombre',
        sortable: true,
        renderer: function (v, p, record) {  //v = dataindex, p= indice, record = registros del datastore
            return '<span><a href="../catalogo/edit.aspx?id=' + record.data.id + '" target="_blank">' + v + '</a></span>';
        }
    },
    {
        header: 'Codigo',
        dataIndex: 'codigo',
        sortable: true
    },
    {
        header: 'Estado',
        dataIndex: 'activo',
        sortable: true,
        renderer: function (v, p, r) {
            var activo = (v) ? 'Activo' : 'Inactivo';
            return '<span>' + activo + '</span>';
        }

    }
    ]);

    cm.defaultSortable = true;

    /*Define Buttons Status
    * */
    var activeButton = new Ext.menu.Item(
    {
        id: 'active',
        text: 'Activo',
        hidden: true,
        icon: '../images/Activo.png"'
    });

    activeButton.on('click', changeStatus);

    var inactiveButton = new Ext.menu.Item(
    {
        id: 'inactive',
        text: 'Inactivo',
        hidden: true,
        icon: '../images/Inactivo.png"'
    });

    inactiveButton.on('click', changeStatus);

    var actionButton = new Ext.SplitButton(
    {
        id: 'CatalogoServiceSplitButtonStatus',
        handler: function () {
            this.showMenu();
        },
        disabled: false,
        tooltip: 'Cambia el Estado del registro seleccionado.',
        text: 'Estado',
        icon: '../images/process.png',
        cls: 'x-btn-text-icon',
        menu: [activeButton, inactiveButton]
    });
    ///-----------------------------------------------------------

    //------------------------------------
    var sm = new Ext.grid.RowSelectionModel(
    {
        singleSelect: true
    });

    sm.on("selectionchange", function () {
        var record = sm.getSelected();

        if (record.data.activo) {
            activeButton.setVisible(false);
            inactiveButton.setVisible(true);
        }
        else {
            activeButton.setVisible(true);
            inactiveButton.setVisible(false);
        }

    });


    var gridPanel = new Ext.grid.GridPanel(
    {
        title: 'Catalogo',
        store: dsCatalogoService,
        cm: cm,
        selModel: sm,
        trackMouseOver: true,
        stripeRows: true,
        width: '100%',
        loadMask: true,
        viewConfig:
        {
            forceFit: true
        },
        tbar: [
        {
            id: 'nuevo',
            text: 'Nuevo',
            tooltip: 'Agregar un nuevo registro',
            icon: '../images/Nuevo16.png',
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.util.openWindow("../catalogo/edit.aspx");
            }
        }, '-',
        {
            text: 'Editar',
            tooltip: 'Edita el registro seleccionado',
            icon: '../images/Editar16.png',
            cls: 'x-btn-text-icon',
            handler: function () {
                var record = gridPanel.getSelectionModel().getSelected();
                if (record == null) {
                    errorMessage = 'Por favor seleccione el catalogo a Editar.';
                    Ext.MessageBox.show(
                    {
                        title: 'ChildDataProcess',
                        msg: errorMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                }
                else {
                    Ext.util.openWindow('../catalogo/edit.aspx?id=' + record.data.id);
                }
            }
        },
        {
            text: 'Borrar',
            tooltip: 'Elimina los registros seleccionados',
            icon: "../images/Eliminar16.png",
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.MessageBox.confirm('Confirm', 'Desea Continuar?', function (value) {
                    if (value != 'yes')
                        return;

                    var basicForm = Ext.util.getForm();

                    var record = null;
                    var ids = new Array();
                    var currentIndex = 0;

                    var records = gridPanel.getSelectionModel().getSelections();

                    for (var i = 0; i < records.length; i++) {
                        ids[i] = records[i].get(idProperty);
                    }

                    basicForm.submit(
                    {
                        waitMsg: 'Borrando Registros, Por favor espere...',
                        url: entityService + '/Borrar',
                        method: 'post',
                        params:
                        {
                            ids: ids
                        },
                        success: function (form, action) {
                            loadDataSource();
                            alert('Sus cambios fueron guardados!');
                        },
                        failure: function (response, action) {
                            var responseText = Ext.util.JSON.decode(action.response.responseText);
                            var errorMessage = responseText.ErrorMessage != null ? responseText.ErrorMessage : '';

                            alert('Sus cambios no fueron guardados. ' + errorMessage);
                        }
                    });
                });
            }
        }, '-', actionButton,
        {
            text: 'Actualizar',
            tooltip: 'Recarga los datos',
            icon: "../images/Actualizar16.png",
            cls: 'x-btn-text-icon',
            handler: loadDataSource
        }, '-', 'Buscar: ', search],
        bbar: paging
    });

    /**
    *@param {Ext.Button} button el boton prersionado
    */
    function changeStatus(button) {
        var basicForm = Ext.util.getForm();

        record = gridPanel.getSelectionModel().getSelect();

        if (record == null) {
            alert('Porfavor seleccione un catalogo');
            return;
        }

        var newStatusId;
        var newStatus;
        var status;
        var id;

        method = "ChangeStatus";
        if (button.id == 'active') {
            newStatusId = 1;
            status = 'activo';
        }
        else {
            if (button.id == 'inactive') {
                newStatusId = 2;
                status = 'inactivo';
            }
        }

        id = record.data.id;

        var recordDescription = "este Catalogo";

        //TODO: Agregar validacion con un confirm si se desea ejecutar la accion...
        //agregar variables neceserias para mandar un mensaje dinamico
        Ext.MessageBox.confirm('Confirmacion de Cambio de Estado', 'Esta seguro que desea cambiar al estado ' + status + ' ' + recordDescription + '?', function (value) {
            if (value != 'yes')
                return;

            basicForm.submit(
                    {
                        url: entityService + '/CambioDeEstado',
                        waitMsg: 'Por Favor Espere...',
                        waitTitle: 'Procesando Datos',
                        params:
                        {
                            id: record.data.id,
                            statusId: newStatusId,
                            note: ''
                        },
                        success: function (a, action) {
                            Ext.MessageBox.alert('ChildDataProcess', 'Sus cambios fueron guardados!');
                            loadDataSource();

                        },
                        failure: function (response, action) {
                            var responseText = Ext.util.JSON.decode(action.response.responseText);
                            var errorMessage = responseText.ErrorMessage != null ? responseText.ErrorMessage : '';

                            Ext.MessageBox.alert('ChildDataProcess', 'Sus cambios no fueron guardados. ' + errorMessage);
                        }
                    });
        });

    }


    function assignBaseParams() {
        dsCatalogoService.baseParams.limit = paging.pageSize;
        dsCatalogoService.baseParams.search = (search.getValue() != undefined ? search.getValue() : '');
    }

    window.gridpanelcatalogo = gridPanel;

    function loadDataSource() {
        dsCatalogoService.load(
        {
            params:
            {
                start: paging.cursor
            }
        });
    }

    return gridPanel;

})();
