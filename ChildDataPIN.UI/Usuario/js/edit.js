Ext.onReady(function () {
    var entityService = '../Usuario/svc/UsuarioSVC.svc';
    var anchor = '96%', isNewRecord = true;

    var StatusEnum =
        {
            Active: '1',
            Inactive: '2'
        };

        var idProperty = "IdUsuario";

    //construccion de dataStore
    var record = new Ext.data.Record.create([{
        name: 'IdUsuario'
    },
        {
            name: 'primer_nombre'
        },
        
        {
            name: 'segundo_nombre'
        },
        {
            name: 'primer_apellido'
        },
        {
            name: 'segundo_apellido'
        },

        {
            name: 'alias'
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
        id: 'primer_nombre',
        //id para acceder al elemento
        name: 'primer_nombre',
        //corresponde al valor en el datastore
        fieldLabel: 'Primer Nombre',
        //Label que se mostrara en pantalla
        anchor: anchor,
        //ancho en pantalla
        //allowBlank: false,
        //si permite o no dejar vacio el campo
        plugins: Ext.util.FieldAccess,
        //plugin para candados
        fieldAccess: 'none'
        //tipo de candado puede ser: none, restricted o locked       
    });

    var Snombre = new Ext.form.TextField({
        id: 'segundo_nombre',
        //id para acceder al elemento
        name: 'segundo_nombre',
        //corresponde al valor en el datastore
        fieldLabel: 'Segundo Nombre',
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

    var PApellido = new Ext.form.TextField({
        id: 'primer_apellido',
        //id para acceder al elemento
        name: 'primer_apellido',
        //corresponde al valor en el datastore
        fieldLabel: 'Primer Apellido',
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


    var SApellido = new Ext.form.TextField({
        id: 'segundo_apellido',
        //id para acceder al elemento
        name: 'segundo_apellido',
        //corresponde al valor en el datastore
        fieldLabel: 'Segundo Apellido',
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


    var alias = new Ext.form.TextField({
        id: 'alias',
        //id para acceder al elemento
        name: 'alias',
        //corresponde al valor en el datastore
        fieldLabel: 'Alias',
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

    var Activo = new Ext.form.TextField({
        id: 'activo',
        //id para acceder al elemento
        name: 'activo',
        //corresponde al valor en el datastore
        fieldLabel: 'Activo',
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
        id: 'IdUsuario',
        name: 'IdUsuario',
        fieldLabel: 'Id',
        allowBlank: false,
        maxLength: 16,
        emptyText: ''
    });

    


    var formPanel = new Ext.ux.XFormPanel({
        frame: true,
        autoScroll: true,
        title: 'Usuario',
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
            text: 'User:Fernando Arias '
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
                 tooltip: 'Crear un nuevo Usuario',
                 icon: "../images/Nuevo.png", //para agregar un icono al boton de menu
                 cls: 'x-btn-text-icon'
             }, '-',
            {
                text: 'Guardar',
                scale: 'medium',
                iconAlign: 'top',
                tooltip: 'Guardar cambios',
                icon: "../images/Guardar.png",
                cls: 'x-btn-text-icon',
                handler: guardar,
                reset: true
            }, '->',
            {
                xtype: 'splitbutton',
                text: 'Cambio de Estado',
                icon: '../images/cambioEstado.png',
                iconAlign: 'top',
                scale: 'medium',
                arrowAlign: 'center',
                tooltip: 'Click aqui para cambiar de estado',
                menu: [{
                    text: 'Activar',
                    scale: 'medium',
                    iconAlign: 'top',
                    icon: '../images/application/email_go.png'
                },
                {
                    text: 'Inactivar',
                    icon: '../images/application/email_go.png'

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
                        items: [Id, nombre, Snombre,PApellido]
                    },
                        {
                            layout: 'form',
                            columnWidth: .5,
                            defaults:
                        {
                            anchor: anchor
                        },
                            items: [SApellido, alias]
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
        title: 'Usuario',
        formPanel: formPanel,
        statusProperty: 'Status',
        tbar: [
        {
            tooltip: 'Agregar nuevo Usuario',
            iconCls: 'new'
        }, '-',
        {
            id: 'save',
            text: 'Save',
            tooltip: 'Save',
            iconCls: 'save'

        },
        {
            id: 'save-close',
            text: 'Save and Close',
            tooltip: 'Guardar y Cerrar',
            iconCls: 'save-close'
        },
        {
            id: 'save-new',
            tooltip: 'Guardar y Crear un nuevo',
            iconCls: 'save-new'
        }, '-',
        {
            id: 'SplitButtonStatus',
            xtype: 'splitbutton',
            handler: function () {
                this.showMenu();
            },
            text: 'Actions',
            tooltip: 'Cambiar el estado del Usuario',
            icon: '../resources/images/application/action.png',
            cls: 'x-btn-text-icon',
            menu: [
            {
                id: 'active',
                text: 'Activar',
                icon: '../resources/images/application/StatusFlagGreen16.png',
                cls: 'x-btn-text-icon'
            },
            {
                id: 'inactive',
                text: 'Inactivar',
                icon: '../resources/images/application/StatusFlagRed16.png',
                cls: 'x-btn-text-icon'
            }]
        },
        {
            tooltip: 'Reload Data',
            iconCls: 'Actualizar'
        }, '-',
        {
            text: 'Close',
            iconCls: 'close',
            tooltip: 'Cierra esta ventana y regresa a la anterior',
            handler: function () {
                window.close();
            }
        }],
        menu: [
        {
            text: 'Opciones de Menu',
            children: [
            {
                text: 'Información',
                component: 'usuario',
                defaultComponent: true
            },
            {
                text: 'Detalle',
                component: 'usuario',
                urlTemplate: '../Usuario/plugin.aspx?id={id}',
                allowedAccess: true
            }]
        }]
    });

    formPanel.getForm().on(
    {
        actioncomplete: function (form, action) {
            var record = Ext.util.getRecordByAction(action);
            navigation.setRecord(record);

            //            if (!isNewRecord)
            //            { }
            //            else {}

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



    //------------save function
    function guardar(button) {
        if (formPanel.getForm().isValid()) {
            formPanel.getForm().submit({
                url: entityService + '/' + (isNewRecord ? 'Guardar' : 'Actualizar'),
                waitMsg: 'Por favor espere...',
                waitTitle: 'Procesando datos',
                params:
                    {
                        usuario: formPanel.getForm().getFieldValues(false)
                    },
                success: function (a, action) {

                    Ext.Msg.alert('PLAN Info', 'Sus cambios fueron guardados!');
                    

                   
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

                    Ext.Msg.alert('PLAN Info.', 'Sus cambios no fueron guardaros. ' + errorMessage);
                }
            });
        }
        else
            Ext.Msg.alert('PLAN Info', 'Por favor, ingrese todos aquellos campos que no estan en la Base de datos.');
    }

});
