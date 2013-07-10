(function () {
    var entityService = '../Usuario/svc/UsuarioSVC.svc';
    var url = entityService + '/TraerMultiples';

    //TODO: do this with the status on the entities
    var StatusEnum =
    {
        Active: '1',
        Inactive: '2'
    }

    var idProperty = 'IdUsuario';

    var fields = [
    { name: 'IdUsuario' },
    { name: 'primer_nombre' },
    { name: 'segundo_nombre' },
    { name: 'primer_apellido' },
    { name: 'segundo_apellido' },
    { name: 'alias' },
    { name: 'activo' },
    { name: 'regpor' },
    { name: 'regen' },
    { name: 'regel' },
    { name: 'actel' },
    { name: 'actpor' },
    { name: 'acten' }
    ];

    var dsUsuarioService = new Ext.data.JsonStore(
    {
        url: url,
        root: 'data',
        totalProperty: 'totalCount',
        id: idProperty,
        fields: fields,
        remoteSort: true,
        sortInfo:
        {
            field: "primer_nombre",
            direction: "ASC"
        }
    });

    dsUsuarioService.on("beforeload", assignBaseParams);

    /**
    * paramName: Es el parametro que se define en el webservice para realizar la busqueda.
    */
    var search = new Ext.ux.form.SearchField(
    {
        paramName: 'search',
        store: dsUsuarioService,
        width: 320
    });

    var paging = new Ext.PagingToolbar(
    {
        store: dsUsuarioService,
        displayInfo: true,
        pageSize: 20
    });

    loadDataSource();

    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
    {
        header: 'Nombres',
        dataIndex: 'primer_nombre',
        sortable: true,
        renderer: function (v, p, record) {  //v = dataindex, p= indice, record = registros del datastore
            return '<span><a href="../Usuario/edit.aspx?id=' + record.data.IdUsuario + '" target="_blank">' + v + ' ' + record.data.segundo_nombre + '</a></span>';
        }
    },
    {
        header: 'Apellidos',
        dataIndex: 'primer_apellido',
        sortable: true,
        renderer: function (v, p, record) {  //v = dataindex, p= indice, record = registros del datastore
            return record.data.primer_apellido + ' ' + record.data.segundo_apellido;
        }
    },
    {
        header: 'Alias',
        dataIndex: 'alias',
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
        text: 'Activar',
        hidden: false,
        icon: '../images/Activo.png"'
    });

    activeButton.on('click', changeStatus);

    var inactiveButton = new Ext.menu.Item(
    {
        id: 'inactive',
        text: 'Inactivar',
        hidden: false,
        icon: '../images/Inactivo.png"'
    });

    inactiveButton.on('click', changeStatus);

    var actionButton = new Ext.SplitButton(
    {
        id: 'UsuarioServiceSplitButtonStatus',
        handler: function () {
            this.showMenu();
        },
        disabled: false,
        tooltip: 'Click aquí para cambiar el Estado del Usuario seleccionado en la Lista',
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
        title: 'Usuario',
        store: dsUsuarioService,
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
            tooltip: 'Agregar un nuevo Usuario',
            icon: '../images/Nuevo16.png',
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.util.openWindow("../Usuario/edit.aspx");
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
                    errorMessage = 'Seleccione un Usuario.';
                    Ext.MessageBox.show(
                    {
                        title: 'ChildDataProcess',
                        msg: errorMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                }
                else {
                    Ext.util.openWindow('../Usuario/edit.aspx?id=' + record.data.IdUsuario);
                }
            }
        },
        {
            text: 'Borrar',
            tooltip: 'Elimina todos los registros seleccionados',
            icon: "../images/Eliminar16.png",
            cls: 'x-btn-text-icon',
            handler: function () {
                Ext.MessageBox.confirm('Confirm', '¿Esta seguro de continuar?', function (value) {
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
            Ext.MessageBox.alert('ChildDataProcess','Porfavor,seleccione un Usuario');
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
        Ext.MessageBox.confirm('Confirmacion de Cambio de Estado', 'Esta seguro que desea cambiar al estado ' + status + ' este Usuario?', function (value) {
            if (value != 'yes')
                return;

            basicForm.submit(
                    {
                        url: entityService + '/CambioDeEstado',
                        waitMsg: 'Por Favor Espere...',
                        waitTitle: 'Procesando Datos',
                        params:
                        {
                            id: record.data.IdUsuario,
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

                            alert('Sus cambios no fueron guardados. ' + errorMessage);
                        }
                    });
        });

    }


    function assignBaseParams() {
        dsUsuarioService.baseParams.limit = paging.pageSize;
        dsUsuarioService.baseParams.search = (search.getValue() != undefined ? search.getValue() : '');
    }

    function loadDataSource() {
        dsUsuarioService.load(
        {
            params:
            {
                start: paging.cursor
            }
        });
    }

    return gridPanel;

})();
