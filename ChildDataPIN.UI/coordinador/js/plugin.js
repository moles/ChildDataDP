(function () {
    var entityService = '../coordinador/svc/CoordinadorSVC.svc';
    var url = entityService + '/TraerMultiples';

    //TODO: do this with the status on the entities
    var StatusEnum =
    {
        Active: '1',
        Inactive: '2'
    }

    var idProperty = 'IdCoordinador';

    var fields = [
    { name: 'IdCoordinador' },
    { name: 'NombreCompleto' },
    { name: 'Sexo' },
    { name: 'Codigo' },
    { name: 'EstadoCoordinador' },
    { name: 'Nota' },
    { name: 'CreadoPorUsuario' },
    { name: 'CreadoEn' },
    { name: 'CreadoEl' },
    { name: 'ModificadoPorUsuario' },
    { name: 'ModificadoEn' },
    { name: 'ModificadoEl' }
   ];

    var dsCoordinadorService = new Ext.data.JsonStore(
    {
        url: url,
        root: 'data',
        totalProperty: 'totalCount',
        id: idProperty,
        fields: fields,
        remoteSort: true,
        sortInfo:
        {
            field: "NombreCompleto",
            direction: "ASC"
        }
    });

    dsCoordinadorService.on("beforeload", assignBaseParams);

    /**
    * paramName: Es el parametro que se define en el webservice para realizar la busqueda.
    */
    var search = new Ext.ux.form.SearchField(
    {
        paramName: 'search',
        store: dsCoordinadorService,
        width: 320
    });

    var paging = new Ext.PagingToolbar(
    {
        store: dsCoordinadorService,
        displayInfo: true,
        pageSize: 20
    });

    loadDataSource();

    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
    {
        header: 'NombreCompleto',
        dataIndex: 'NombreCompleto',
        sortable: true,
        renderer: function (v, p, record) {  //v = dataindex, p= indice, record = registros del datastore
            return '<span><a href="../coordinador/edit.aspx?id=' + record.data.IdCoordinador + '" target="_blank">' + v + ' ' + record.data.NombreCompleto + '</a></span>';
        }
    },
    {
        header: 'Sexo',
        dataIndex: 'Sexo',
        sortable: true,
        renderer: function (v, p, record) {  //v = dataindex, p= indice, record = registros del datastore
            return record.data.Sexo;
        }
    },
    {
        header: 'Codigo',
        dataIndex: 'Codigo',
        sortable: true
    },
    {
        header: 'EstadoCoordinador',
        dataIndex: 'EstadoCoordinador',
        sortable: true
    },
    {
        header: 'Nota',
        dataIndex: 'Nota',
        sortable: true
    }
    ]);

    cm.defaultSortable = true;

    /*Define Buttons Status
    * */
    var activeButton = new Ext.menu.Item(
    {
        id: 'active',
        text: 'Activo',
        hidden: false,
        icon: '../images/Activo.png"'
    });

    activeButton.on('click', changeStatus);

    var inactiveButton = new Ext.menu.Item(
    {
        id: 'inactive',
        text: 'Inactivo',
        hidden: false,
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
        title: 'Coordinador',
        store: dsCoordinadorService,
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
            tooltip: 'Agregar un nuevo Coordinador',
            icon: '../images/Nuevo16.png',
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.util.openWindow("../coordinador/edit.aspx");
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
                    Ext.MessageBox.alert('ChildDataProcess', 'Por favor seleccione un Coordinador.');
             }
                else {
                    Ext.util.openWindow('../coordinador/edit.aspx?id=' + record.data.id);
                }
            }
        },
        {
            text: 'Borrar',
            tooltip: 'Elimina todos los registros seleccionados',
            icon: "../images/Eliminar16.png",
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.MessageBox.confirm('ChildDataProcess', 'Esta seguro de Continuar?', function (value) {
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

        record = gridPanel.getSelectionModel().getSelected();

        if (record == null) {
            Ext.MessageBox.alert('ChildDataProcess', 'Por favor seleccione un Coordinador.');
            return;
        }

        var newStatusId, newStatus, status;

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
      
        //TODO: Agregar validacion con un confirm si se desea ejecutar la accion...
        //agregar variables neceserias para mandar un mensaje dinamico
        Ext.MessageBox.confirm('Confirmacion de Cambio de Estado', 'Esta seguro que desea cambiar al estado ' + status + ' este coordinador?', function (value) {
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
                            Ext.Msg.show({
                                title: 'ChildDataProcess',
                                msg: 'sus cambios fueron guardados',
                                buttons: Ext.Msg.OK,
                                fn: loadRecord,
                                icon: Ext.MessageBox.INFORMATION
                            });
                        },
                        failure: function (response, action) {
                            var responseText = Ext.util.JSON.decode(action.response.responseText);
                            var errorMessage = responseText.ErrorMessage != null ? responseText.ErrorMessage : '';

                           Ext.MessageBox.alert('Sus cambios no fueron guardados. ' + errorMessage);
                        }
                    });
        });

    }


    function assignBaseParams() {
        dsCoordinadorService.baseParams.limit = paging.pageSize;
        dsCoordinadorService.baseParams.search = (search.getValue() != undefined ? search.getValue() : '');
    }
    window.gridpanelcoordinador = gridPanel;
    function loadDataSource() {
        dsCoordinadorService.load(
        {
            params:
            {
                start: paging.cursor
            }
        });
    }

    return gridPanel;

})();
