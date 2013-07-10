﻿Ext.onReady(function () {
    var entityService = '../catalogo/svc/CatalogoSVC.svc';
    var anchor = '96%', isNewRecord = true;

    var StatusEnum =
        {
            Active: '1',
            Inactive: '2'
        };

    var idProperty = "id";

    //construccion de dataStore
    var record = new Ext.data.Record.create([{
        name: 'id'
    },
        {
            name: 'nombre'
        },
        {
            name: 'codigo'
        },
        {
            name: 'activo'
        },
        {
            name: 'regpor'
        },
        {
            name: 'regen'
        },
        {
            name: 'regel',
            type: 'date',
            dateFormat: 'M$'
        },
        {
            name: 'actel',
            type: 'date',
            dateFormat: 'M$'
        },
        {
            name: 'actpor'
        },
        {
            name: 'acten'
        }]);

    //Forms Controls
    var nombre = new Ext.form.TextField({
        id: 'nombre',
        //id para acceder al elemento
        name: 'nombre',
        //corresponde al valor en el datastore
        fieldLabel: 'Nombre',
        //Label que se mostrara en pantalla
        anchor: anchor,
        //ancho en pantalla
        allowBlank: false,
        //si permite o no dejar vacio el campo
        plugins: Ext.util.FieldAccess,
        //plugin para candados
        fieldAccess: 'none'
        //tipo de candado puede ser: none, restricted o locked       
    });

    var codigo = new Ext.form.TextField({
        id: 'codigo',
        //id para acceder al elemento
        name: 'codigo',
        //corresponde al valor en el datastore
        fieldLabel: 'Codigo',
        //Label que se mostrara en pantalla
        anchor: anchor,
        //ancho en pantalla
        allowBlank: false,
        //si permite o no dejar vacio el campo
        plugins: Ext.util.FieldAccess,
        //plugin para candados
        fieldAccess: 'none'
        //tipo de candado puede ser: none, restricted o locked       
    });

    var regpor = new Ext.form.TextField({
        id: 'regpor',
        name: 'regpor',
        fieldLabel: 'Registrado Por',
        anchor: anchor,
        plugins: Ext.util.FieldAccess,
        fieldAccess: 'restricted'
    });

    var actpor = new Ext.form.TextField({
        id: 'actpor',
        name: 'actpor',
        fieldLabel: 'Actualizado Por',
        anchor: anchor,
        plugins: Ext.util.FieldAccess,
        fieldAccess: 'restricted'
    });

    var regel = new Ext.form.DateField({
        id: 'regel',
        name: 'regel',
        fieldLabel: 'Registrado el',
        allowBlank: true,
        format: 'M d, Y',
        emptyText: '',
        plugins: Ext.util.FieldAccess,
        fieldAccess: 'restricted'
    });

    var actel = new Ext.form.DateField({
        id: 'actel',
        name: 'actel',
        fieldLabel: 'Actualizado el',
        allowBlank: true,
        format: 'M d, Y',
        emptyText: '',
        plugins: Ext.util.FieldAccess,
        fieldAccess: 'restricted'
    });


    var Id = new Ext.form.Hidden({
        id: 'id',
        name: 'id',
        fieldLabel: 'Id',
        allowBlank: false,
        maxLength: 16,
        emptyText: ''
    });



    var formPanel = new Ext.ux.XFormPanel({
        frame: true,
        autoScroll: true,
        title: 'Catalogos',
        reader: new Ext.data.JsonReader({
            idProperty: idProperty,
            root: "entity",
            totalProperty: 'totalCount'
        }, record),
        bbar: [status = new Ext.form.Label({
            style: 'color: white; font-weight: bold;',
            text: 'Status: N/A '
        }), '-', '->', new Ext.form.Label({
            style: 'color: white; font-weight: bold;',
            text: 'User: Modesto Bobadilla'
        })],
        items: [{
            id: 'tabpanel',
            tabWidth: 150,
            xtype: 'tabpanel',
            resizeTabs: true,
            deferredRender: false,
            plain: true,
            activeTab: 0,
            enableTabScroll: true,
            defaults:
            {
                autoScroll: true,
                autoHeight: true,
                bodyStyle: 'padding:10px'
            },
            //plain: false,
            layoutOnTabChange: true,
            baseCls: 'x-plain',
            tbar: [
             {
                 text: 'Nuevo',
                 scale: 'medium',
                 iconAlign: 'top',
                 tooltip: 'Crear un nuevo catalogo',
                 icon: "../images/Nuevo.png", //para agregar un icono al boton de menu
                 cls: 'x-btn-text-icon'
             }, '-',
            {
                text: 'Guardar',
                scale: 'medium',
                iconAlign: 'top',
                tooltip: 'Guardar los cambios',
                icon: "../images/Guardar.png",
                cls: 'x-btn-text-icon',
                handler: guardar
            }, '->',
            {
                xtype: 'splitbutton',
                text: 'Cambio de Estado',
                handler: function () {
                    this.showMenu();
                },
                icon: '../images/cambioestado.png',
                iconAlign: 'top',
                scale: 'medium',
                arrowAlign: 'center',
                tooltip: 'Click aqui para cambiar el Estado del Catalogo',
                menu: [{
                    id: 'active',
                    text: 'Activar',
                    scale: 'medium',
                    iconAlign: 'top',
                    icon: '../images/Activo.png',
                    handler: changeStatus
                },
                {
                    id: 'inactive',
                    text: 'Inactivar',
                    icon: '../images/Inactivo.png',
                    handler: changeStatus
                }]
            }],
            items: [{
                title: 'Informacion General',
                layout: 'form',
                labelWidth: 130,
                items: [{
                    layout: 'column',
                    title: 'Datos Generales',
                    xtype: 'fieldset',
                    items: [{
                        layout: 'form',
                        columnWidth: .5,
                        defaults:
                        {
                            anchor: anchor
                        },
                        items: [Id, codigo, nombre]
                    }]
                },
                {
                    layout: 'column',
                    title: 'Datos de Auditoria',
                    xtype: 'fieldset',
                    items: [{
                        layout: 'form',
                        columnWidth: .5,
                        defaults:
                        {
                            anchor: anchor
                        },
                        items: [regpor, regel]
                    },
                    {
                        layout: 'form',
                        columnWidth: .5,
                        defaults:
                        {
                            anchor: anchor
                        },
                        items: [actpor, actel]
                    }]
                }]
            }]
        }]
    });



    var navigation = new Ext.ux.navigation(
    {
        title: 'Catalogo',
        formPanel: formPanel,
        statusProperty: 'Status',

        menu: [
        {
            text: 'Opciones de Menu',
            children: [
            {
                text: 'Information',
                component: 'catalogo',
                defaultComponent: true
            },
            {
                text: 'Detalle',
                component: 'catalogodetalle',
                urlTemplate: '../catalogodetalle/plugin.aspx?id={id}',
                allowedAccess: true
            }]
        }]
    });




    formPanel.getForm().on(
    {
        actioncomplete: function (form, action) {
            var record = Ext.util.getRecordByAction(action);
            navigation.setRecord(record);


            //            if (!isNewRecord == false) {
            //                
            //            }
            //            else { }

            if (getEntityId != null && record.data.activo == true) {
                Ext.getCmp('active').setDisabled(true);
                Ext.getCmp('inactive').setDisabled(false);
            } else if (getEntityId != null && record.data.activo == false) {
                Ext.getCmp('inactive').setDisabled(true);
                Ext.getCmp('active').setDisabled(false);
            } else if (isNewRecord) {
                Ext.getCmp('active').setDisabled(true);
                Ext.getCmp('inactive').setDisabled(true);
                Ext.getCmp('SplitButtonStatus').setDisabled(true);
            }
        }
    });

    loadRecord();

    function loadRecord() {
        formPanel.getForm().load({
            url: entityService + '/TraerDatos',
            method: 'post',
            waitMsg: 'Por favor espere...',
            waitTitle: 'Cargando',
            params:
            {
                id: getEntityId()
            }
        });
    }

    function getEntityId() {
        var value = '<%=Request.Params.Get("id")%>';
        return ((isNewRecord = (value == '')) ? null : value);
    }

    function create() {
        window.location = "../cashier/edit.aspx?";
    }

    //-------------cambiando de estado
    function changeStatus(button) {
        var basicForm = Ext.util.getForm();

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
        Ext.MessageBox.confirm('Confirmacion de Cambio de Estado', 'Esta seguro que desea cambiar al estado ' + status + ' este catalogo?', function (value) {
            if (value != 'yes')
                return;

            basicForm.submit(
                    {
                        url: entityService + '/CambioDeEstado',
                        waitMsg: 'Por Favor Espere...',
                        waitTitle: 'Procesando Datos',
                        params:
                        {
                            id: getEntityId(),
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

                            Ext.MessageBox.alert('ChildDataProcess', 'Sus cambios no fueron guardados. ' + errorMessage);
                        }

                    });
        });

    }


    //------------save function
    function guardar(button) {
        if (formPanel.getForm().isValid()) {
            formPanel.getForm().submit({
                url: entityService + '/' + (isNewRecord ? 'Guardar' : 'Actualizar'),
                waitMsg: 'Por favor espere...',
                waitTitle: 'Procesando datos',
                params:
                    {
                        catalogo: formPanel.getForm().getFieldValues(false)
                    },
                success: function (a, action) {
                    Ext.Msg.alert('ChildDataProcess', 'Sus cambios fueron guardados!');
                    reloadparentgrid();
                    if (isNewRecord) {
                        var entity = Ext.util.getRecordByAction(action);
                        document.location = "edit.aspx?id=" + entity.data[idProperty];
                    }
                    else {
                        loadRecord();
                    }

                },
                failure: function (response, action) {
                    var responseText = Ext.util.JSON.decode(action.response.responseText);
                    var errorMessage = responseText.ErrorMessage != null ? responseText.ErrorMessage : '';

                    Ext.Msg.alert('ChildDataProcess', 'Sus cambios no fueron guardados. ' + errorMessage);
                }
            });
        }
        else
            Ext.Msg.alert('ChildDataProcess', 'Por favor, ingrese todos los campos requeridos');
    }

});

function reloadparentgrid() {
    if (window.opener.gridpanelcatalogo != undefined) {
        window.opener.gridpanelcatalogo.store.load();
    }
}