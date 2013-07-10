/**
* @class Ext.ux.form.SeamBasicForm
* @extends Ext.form.BasicForm
* Supplies the functionality to do "actions" on forms and initialize 
* Ext.form.Field types on existing markup.
* By default, Ext Forms are submitted through Ajax, using {@link Ext.form.Action}.  However
* this version will use the Seam Remoting abstraction to Ajax.
* @constructor
* @param {Mixed} el The form element or its id
* @param {Object} config Configuration options
*/
Ext.ux.XBasicForm = function (el, config) {
    Ext.ux.XBasicForm.superclass.constructor.call(this, el, config);
};


Ext.extend(Ext.ux.XBasicForm, Ext.form.BasicForm, {
    /*loadRecord: function (record) {
    alert(Ext.util.JSON.encode(record.data));
    if (record != null && record != undefined)
    this.setValues(record.data, record);

    return this;
    },*/
    setValues: function (values) {
        var record = new Ext.data.Record(values);

        if (Ext.isArray(values)) {
            for (var i = 0, len = values.length; i < len; i++) {
                var v = values[i];
                var f = this.findField(v.id);
                if (f) {
                    if (!f.handleRecord) {
                        f.setValue(v.value);
                    }
                    else
                        f.setRecord(record);
                    if (this.trackResetOnLoad) {
                        f.originalValue = f.getValue();
                    }
                }
            }
        }
        else {
            var field, id;
            for (id in values) {
                if (typeof values[id] != 'function' && (field = this.findField(id))) {
                    if (!field.handleRecord) {

                        field.setValue(values[id]);
                    }
                    else {
                        field.setRecord(record);
                    }
                    if (this.trackResetOnLoad) {
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },
    /**
    * Retrieves the fields in the form as a set of key/value pairs, using the {@link Ext.form.Field#getValue getValue()} method.
    * If multiple fields exist with the same name they are returned as an array.
    * @param {Boolean} dirtyOnly (optional) True to return only fields that are dirty.
    * @return {Object} The values in the form
    */
    getFieldValues: function (dirtyOnly) {

        var o = {},
            n,
            key,
            val;
        this.items.each(function (f) {
            if (dirtyOnly !== true || f.isDirty()) {
                n = f.getName();
                key = o[n];
                val = f.getValue();

                val = val != null && val.toString() != '' ? val : null; //Greivin: This line is a hack

                if (val != null && f.getXType() == 'datefield') {
                    val = '\/Date(' + val.getTime() + '+0000)\/';
                }

                if (Ext.isDefined(key)) {
                    if (Ext.isArray(key)) {
                        o[n].push(val);
                    } else {
                        o[n] = [key, val];
                    }
                } else {
                    o[n] = val;
                }
            }
        });
        return o;
    }
});

Ext.ux.XFormPanel = Ext.extend(Ext.form.FormPanel,
{
    id: 'form-panel',
    frame: true,
    autoScroll: true,
    initComponent: function () {
        Ext.ux.XFormPanel.superclass.initComponent.call(this);

        this.addEvents('notificationchange');
    },
    createForm: function () {
        var config = Ext.applyIf({ listeners: {} }, this.initialConfig);
        return new Ext.ux.XBasicForm(null, config);
    }//,
//    addNotification: function (id, msg) {
//        this.fireEvent('notificationchange', id, msg, this);
//    }
});

Ext.ux.TabPanel = function (config) {
    Ext.apply(this, config);

    Ext.ux.TabPanel.superclass.constructor.call(this,
    {
        id: 'tabpanel',
        resizeTabs: true,
        activeTab: 0,
        enableTabScroll: true,
        deferredRender: false,
        layoutOnTabChange: true,
        defaults:
        {
            bodyStyle: 'padding:5px'
        },
        plain: true,
        baseCls: 'x-plain'
    });
};
Ext.extend(Ext.ux.TabPanel, Ext.TabPanel, {});

Ext.ux.MenuPanel = function (config) {
    Ext.ux.MenuPanel.superclass.constructor.call(this,
    {
        id: 'menu-panel',
        root: new Ext.tree.TreeNode('Menu'),
        title: config.title,
        split: true,
        width: config.width ? config.width : 200,
        maxSize: 400,
        collapsible: true,
        margins: '5 5 5 5',
        cmargins: '5 5 5 5',
        rootVisible: false,
        lines: true,
        autoScroll: true,
        collapseFirst: false
    });
    this.getSelectionModel().on(
    {
        'beforeselect': function (sm, node) {
            return node.isLeaf();
        },
        'selectionchange': function (sm, node) {
            this.previousComponentNode = this.currentComponentNode;
            this.currentComponentNode = node;
            if (node != this.defaultComponentNode)
                this.mask();
            this.fireEvent('menuitemselect', node);
        },
        scope: this
    });
    this.addEvents(
    {
        menuitemselect: true
    });
    var length = config.menu.length, children, node, auxNode;
    for (var i = 0; i < length; i++) {
        config.menu[i].cls = 'menu-group';
        config.menu[i].iconCls = 'menu-item-parent';
        config.menu[i].expanded = (config.menu[i].expanded == null ? true : config.menu[i].expanded);
        node = new Ext.tree.TreeNode(config.menu[i]);
        children = config.menu[i].children;
        for (var j = 0; j < children.length; j++) {
            children[j].cls = "menu-item";
            children[j].iconCls = (children[j].iconCls == null ? children[j].component + '16x16' : children[j].iconCls);
            children[j].leaf = true;
            node.appendChild(auxNode = new Ext.tree.TreeNode(children[j]));
            if (children[j].defaultComponent == true)
                this.defaultComponentNode = auxNode;
        }
        this.root.appendChild(node);
    }
};

Ext.extend(Ext.ux.MenuPanel, Ext.tree.TreePanel,
{
    region: 'west',
    defaultComponentNode: null,
    currentComponentNode: null,
    previousComponentNode: null,
    getDefaultComponentNode: function () {
        return this.defaultComponentNode;
    },
    getSelectedNode: function () {
        return this.currentComponentNode;
    },
    commitSelection: function () {
        this.unMask();
    },
    cancelSelection: function () {
        this.currentComponentNode = this.previousComponentNode;
        this.currentComponentNode.select();
        this.previousComponentNode = null;
        this.unMask();
    },
    mask: function () {
        this.getEl().mask();
    },
    unMask: function () {
        this.getEl().unmask();
    },
    selectDefaultComponentNode: function () {
        this.defaultComponentNode.select();
    }
});
Ext.ux.ComponentHolder = function (config) {
    Ext.ux.ComponentHolder.superclass.constructor.call(this,
    {
        id: 'component-holder'
    });

    this.formPanel = config.formPanel;
    this.add(config.formPanel);
};
Ext.extend(Ext.ux.ComponentHolder, Ext.Panel,
{
    layout: 'fit',
    region: 'center',
    formPanel: null,
    currentComponent: null,
    loadComponent: function (node) {
        var navigation = this;
        if (node.attributes.defaultComponent == true)
            this.setComponent(this.formPanel, node);
        else {
            if (node.attributes.url != null) {
                this.mask();
                Ext.Ajax.request(
                {
                    url: node.attributes.url,
                    success: function (xhr) {
                        try {
                            var newComponent = eval(xhr.responseText);
                            navigation.setComponent(newComponent, node);
                        }
                        catch (ex) {
                            alert('Exception ' + ex);

                            navigation.fireEvent('componentloadfailure', this);
                        }
                        navigation.unMask();
                    },
                    failure: function () {
                        alert('failure');
                        navigation.fireEvent('componentloadfailure', this);
                        navigation.unMask();
                    }
                });
            }
            else {
                alert('fallo al cargar la URL');
                this.fireEvent('componentloadfailure', this);
            }
        }
    },
    setComponent: function (component, node) {
        try {
            var currentComponent = this.getComponent(0), scope = this;
            currentComponent.hide();
            this.remove(currentComponent, !(this.formPanel == currentComponent));
            component.show();
            this.add(component);

            this.doLayout();
            this.fireEvent('componentloadsuccess', this);

            if (this.formPanel != component)
                component.on('datachanged', function () {
                    scope.fireEvent('subcomponentdatachanged', component);
                });
        }
        catch (ex) {
            this.fireEvent('componentloadfailure', this);
        }
    },
    mask: function () {
        this.getEl().mask('...');
    },
    unMask: function () {
        this.getEl().unmask();
    }
});

Ext.ux.navigation = function (config) {
    Ext.apply(this, config);
    Ext.ux.navigation.superclass.constructor.call(this,
    {
        id: 'navigation'
    });
};

Ext.extend(Ext.ux.navigation, Ext.Viewport,
{
    titleTemplate: '',
    topPanel: null,
    componentHolder: null,
    menuPanel: null,
    bottomPanel: null,
    currentRecord: null,
    statusProperty: null,
    user: null,
    component: null,
    initComponent: function () {
        Ext.lib.Ajax.defaultPostHeader = 'application/json';

        this.initTopPanel();

        this.initMenuPanel(
        {
            menu: this.menu
        });

        //this.initBottomPanel();

        this.initComponentHolder(
        {
            formPanel: this.formPanel
        });

        Ext.apply(this,
        {
            layout: 'fit',
            monitorResize: true,
            items: new Ext.Panel(
            {
                layout: 'border',
                tbar: this.topPanel,
                items: [
                (this.menuPanel != null ? this.menuPanel : new Ext.Panel(
                {
                    hidden: true
                })), this.componentHolder]
                //bbar: this.bottomPanel
            })
        });

        this.on('afterrender', function () {
            if (this.menuPanel) {
                this.menuPanel.selectDefaultComponentNode();
                this.updateMenu();
                this.updateTitle();
                this.setUser(this.user);
            }

            //This two lines are require because if the panel is visible initially the screen flick
            //Esto no esta funcionando la pantalla siempre tiene un render tardado.
            //this.bottomPanel.show();
            this.doLayout();

            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
        });

        Ext.ux.navigation.superclass.initComponent.apply(this, arguments);
    },
    initComponentHolder: function (config) {
        var navigation = this;
        this.componentHolder = new Ext.ux.ComponentHolder(
        {
            formPanel: config.formPanel,
            html: 'component-holder'
        });

        this.componentHolder.on('subcomponentdatachanged', function () {
            navigation.search(true);
        });

        if (this.menuPanel) {
            this.componentHolder.on('componentloadsuccess', function () {
                navigation.menuPanel.commitSelection();
            });

            this.componentHolder.on('componentloadfailure', function () {
                alert('El componente no fue cargado');
                navigation.menuPanel.cancelSelection();
            });
        }
    },

    initTopPanel: function () {
        var titleTemplateMarkup = ['<div class="title-box-container">', '<div class="title-box-main {DefaultComponentName}48x48">', '<span class="title-box-main-title">{DefaultComponentTitle}: {Description}</span>', '<br>', '<span class="title-box-subtitle {CurrentComponentName}16x16">', '{CurrentComponentTitle}', '</span>', '</div>', '</div>'];

        this.titleTemplate = new Ext.Template(titleTemplateMarkup);

        this.topPanel = new Ext.Panel(
        {
            layout: 'form',
            id: 'top-panel',
            height: 40,
            collapsible: true,
            style: '',
            collapsed: true,
            animCollapse: true,
            tbar: new Ext.Toolbar(
            {
                id: 'top-panel-toolbar',
                style: 'position:inherit; height: 40px;',
                items: [{ html: '<div style= "color: white; padding: 10px;">Aqui se supone que deberia poner algun texto o grafico del workflow de la pantalla en la que estoy</div>'}]
                //				this.tbar
                //                ]
            })
        });
    },
    initBottomPanel: function () {
        //        this.statusLabel = new Ext.Toolbar.TextItem('');
        //        this.userLabel = new Ext.Toolbar.TextItem('');

        //        this.bottomPanel = new Ext.ux.StatusBar(
        //        {
        //            id: 'form-statusbar',
        //            defaultText: '',
        //            statusAlign: 'right',
        //            plugins: new Ext.ux.ValidationStatus(
        //            {
        //                form: 'form-panel'
        //            }),
        //            items: [this.statusLabel,
        //			'->', '-', this.userLabel]
        //        });
    },
    /**
    * OCFS
    * Update Status Visibility in the bottom bar
    * actualiza la visibilidad del Status para los component que no son defaultComponent
    * void
    */
    //    updateBottomPanel: function () {
    //        var record = this.currentRecord;
    //        var selectedNode = this.menuPanel.getSelectedNode();
    //        if (!selectedNode.attributes.defaultComponent)
    //            this.clearStatus();
    //        else
    //            if (record != null)
    //                Ext.fly(this.statusLabel.getEl()).update("<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>");
    //    },
    /**
    *OCFS
    *Update topPanel Visibility
    *actualiza la visibilidad del topPanel para los component que no son defaultComponent
    *void
    */
    updateTopPanel: function () {
        var record = this.currentRecord;
        var selectedNode = this.menuPanel.getSelectedNode();
        //if(this.allowTopBarInPlugins)
        Ext.getCmp('top-panel-toolbar').setVisible(selectedNode.attributes.defaultComponent);
    },
    updateTitle: function () {
        var titleBox, selectedNode, hasMenu = this.menuPanel != null;

        titleBox = Ext.getCmp('title-box');

        if (hasMenu)
            selectedNode = this.menuPanel.getSelectedNode();

//        this.titleTemplate.overwrite(titleBox.body,
//        {
//            DefaultComponentTitle: this.title,
//            DefaultComponentName: (hasMenu ? this.menuPanel.getDefaultComponentNode().attributes.component : this.component),
//            Description: this.description,
//            CurrentComponentTitle: (hasMenu ? selectedNode.text : ''),
//            CurrentComponentName: (hasMenu ? selectedNode.attributes.component : '')
//        });
    },
    showWorkFlow: function () {
        window.showModalDialog("../help/" + this.menuPanel.getDefaultComponentNode().attributes.component + "/workflow.htm");
    },
    setDescription: function (description) {
        this.description = description;

        this.updateTitle();
    },
    setRecord: function (record) {
        this.currentRecord = record;

        this.updateMenu();

        if (this.statusProperty != null) {
            var sb = Ext.getCmp('form-statusbar');

            var selectedNode = this.menuPanel.getSelectedNode();

            //            if (!selectedNode.attributes.defaultComponent)
            //                this.clearStatus();
            //            else
            //                Ext.fly(this.statusLabel.getEl()).update("<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>");

            //Ext.fly(this.statusLabel.getEl()).update("<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>");
            /*sb.setStatus(
            {
            text: "<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>",
            //iconCls: 'x-status-error',
            clear: false // auto-clear after a set interval
            });*/
        }

        var items = this.componentHolder.formPanel.findByType('iframe');

        for (var i = 0; i < items.length; i++) {
            this.tpl.set(items[i].urlTemplate);

            items[i].setURL(this.tpl.apply(record.data, true));
        }
    },
    /**
    * OCFS
    * Clear Status Text on bottom bar
    * void
    */
    clearStatus: function (value) {
        Ext.fly(this.statusLabel.getEl()).update("");
    },
    setUser: function (value) {
        if (value != null) {
            Ext.fly(this.userLabel.getEl()).update("<b>User:&nbsp;" + value + "</b>");
        }

    },
    initMenuPanel: function (config) {
        this.tpl = new Ext.Template("");

        if (config.menu == null)
            return;

        navigation = this;

        this.menuPanel = new Ext.ux.MenuPanel(
        {
            title: this.title,
            width: this.width,
            html: 'Menu Panel',
            menu: config.menu
        });
        this.menuPanel.on('menuitemselect', function (node) {
            navigation.updateTitle();
            //navigation.updateBottomPanel(); //OCFS actualiza el status para los plugins que no son default
            navigation.updateTopPanel(); //OCFS actualiza el topPanel para los plugins que no son default
            navigation.componentHolder.loadComponent(node);
        });
    },
    updateLink: function (fn) {
        this.linkPanel.root.eachChild(function (node) {
            node.eachChild(fn);
        }, this);
    },
    /**
    * Only if the menuPanel is visible.
    */
    updateMenu: function () {
        if (this.menuPanel) {
            var navigation = this;

            this.menuPanel.root.eachChild(function (node) {
                //node.eachChild(navigation.validateMenuLink, navigation);
                node.eachChild(function (node) {
                    navigation.validateMenuLink(node, navigation);
                })
            });
        }
    },
    /**
    * OCFS
    * Disable the Menu Panel Items but the default Item
    */
    disableMenuPanelItems: function () {
        if (this.menuPanel) {
            this.menuPanel.root.eachChild(function (node) {
                node.eachChild(function (node) {
                    //Solo el nodo del default component puede estar habilitado siempre.
                    if (!node.attributes.defaultComponent) {
                        node.disable();
                    }
                });
            });
        }
        return true;
    },
    /**
    * OCFS
    * Enable the Menu Panel Items but the default Item
    */
    enableMenuPanelItems: function () {
        if (this.menuPanel) {
            this.menuPanel.root.eachChild(function (node) {
                node.eachChild(function (node) {
                    node.enable();

                });
            });
        }
        return true;
    },
    /**
    *
    * @param {Object} node
    * @param {Object} scope
    */
    validateMenuLink: function (node, scope) {
        //Solo el nodo del default component puede estar habilitado siempre.
        if (!node.attributes.defaultComponent) {
            //Si el nodo no tiene acceso o el registro actual es null entonces se deshabilita
            if (node.attributes.allowedAccess && scope.currentRecord != null && !scope.currentRecord.data.IsNewRecord) //Indicates that this node must be validated with
            {
                //Se supone que todos los nodos que estan aca tienen relacion con el registro cargado
                //por lo tanto deben tener un url template.
                if (node.attributes.urlTemplate && scope.currentRecord.data) {
                    scope.tpl.set(node.attributes.urlTemplate);

                    if (node.attributes.validate == null) //Si no tiene una funcion para validarlo entonces se habilita
                        node.enable();
                    else
                        node.attributes.validate(node, scope.currentRecord.data); //Se ejecuta la funcion que tenga definida para validarlo

                    node.attributes.url = scope.tpl.apply(scope.currentRecord.data, true);
                }
                else
                    node.disable();
            }
            else
                node.disable();
        }

        return true;
    },
    /**
    A los menu que se les quiera actualizar el status dinamicamente se les debe poner un id y se debe
    llamar a este metodo para hacerlo, el cual a su vez utiliza el metodo validateMenuLink en caso
    que el nodo se esta habilitando de lo contrario se deshabilita de inmediato.
    **/
    setMenuDisabled: function (nodeId, disabled) {
        var node = null;
        /**
        * Menu category
        * @param {Ext.tree.Node} group
        */
        this.menuPanel.root.eachChild(function (group) {
            node = group.findChild("id", nodeId);

            return node == null;
        });

        if (node != null) {
            if (disabled)
                node.disable();
            else
                this.validateMenuLink(node, this);
        }
    }
});