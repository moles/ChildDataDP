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
Ext.ux.XBasicForm = function(el, config) {
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
    getFieldValues : function(dirtyOnly){
		
        var o = {},
            n,
            key,
            val;
        this.items.each(function(f) {
            if (dirtyOnly !== true || f.isDirty()) {
                n = f.getName();
                key = o[n];
                val = f.getValue();

                val = val != null && val.toString() != '' ? val : null; //Greivin: This line is a hack
   				
   				if (val != null && f.getXType() == 'datefield') 
                {
                    val = '\/Date(' + val.getTime() + '+0000)\/';					
                }
				
                if(Ext.isDefined(key)){
                    if(Ext.isArray(key)){
                        o[n].push(val);
                    }else{
                        o[n] = [key, val];
                    }
                }else{
                    o[n] = val;
                }
            }
        });
        return o;
    }   
});

Ext.ux.XFormPanel = Ext.extend(Ext.form.FormPanel,
{
	id:'form-panel',
	frame: true,
    autoScroll: true,
	initComponent: function()
    {
        Ext.ux.XFormPanel.superclass.initComponent.call(this);
        
        this.addEvents('notificationchange');
    },
    createForm: function () {
        //delete this.initialConfig.listeners;
        //return new Ext.ux.XBasicForm(null, this.initialConfig);		
		var config = Ext.applyIf({listeners: {}}, this.initialConfig);
        return new Ext.ux.XBasicForm(null, config);
    },
    addNotification: function(id, msg)
    {
		this.fireEvent('notificationchange', id, msg, this);
    }
});

Ext.ux.TabPanel = function(config)
{
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
        var componentViewer = this;
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
                            componentViewer.setComponent(newComponent, node);
                        }
                        catch (ex) {
                            alert(ex);

                            componentViewer.fireEvent('componentloadfailure', this);
                        }
                        componentViewer.unMask();
                    },
                    failure: function () {
                        alert('failure');
                        componentViewer.fireEvent('componentloadfailure', this);
                        componentViewer.unMask();
                    }
                });
            }
            else {
                alert('failure');
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
            alert(ex);
            this.fireEvent('componentloadfailure', this);
        }
    },
    mask: function () {
        this.getEl().mask('Loading...');
    },
    unMask: function () {
        this.getEl().unmask();
    }
});
Ext.ux.ComponentViewer = function (config) {
    Ext.apply(this, config);
    Ext.ux.ComponentViewer.superclass.constructor.call(this,
    {
        id: 'component-viewer'
    });
};

Ext.extend(Ext.ux.ComponentViewer, Ext.Viewport,
{
    titleTemplate: '',
    topPanel: null,
    componentHolder: null,
    outlinePanel: null,
    bottomPanel: null,
	currentRecord: null,
	statusProperty: null,
	user: null,    
    initComponent: function () {
        Ext.lib.Ajax.defaultPostHeader = 'application/json';

        this.initTopPanel();

        this.initMenuPanel(
        {
            menu: this.menu
        });

        this.initBottomPanel();

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
                items: [this.outlinePanel, this.componentHolder],
                bbar: this.bottomPanel
            })
        });

        this.on('afterrender', function () {
            if (this.outlinePanel) {
				this.setUser(this.user);
            }

            //This two lines are require because if the panel is visible initially the screen flick
			//Esto no esta funcionando la pantalla siempre tiene un render tardado.
            this.bottomPanel.show();
            this.doLayout();

            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
        });

        Ext.ux.ComponentViewer.superclass.initComponent.apply(this, arguments);
    },
    initComponentHolder: function (config) {
    var componentViewer = this;
    this.componentHolder = new Ext.ux.ComponentHolder(
        {
            formPanel: config.formPanel,
            html: 'Component Holder'
        });

    this.componentHolder.on('subcomponentdatachanged', function () {
        componentViewer.search(true);
    });

    if (this.outlinePanel) {
        this.componentHolder.on('componentloadsuccess', function () {
            componentViewer.outlinePanel.commitSelection();
        });

        this.componentHolder.on('componentloadfailure', function () {
            alert('Could not load the component.');
            componentViewer.outlinePanel.cancelSelection();
        });
    }
},

    initTopPanel: function () {
        var titleTemplateMarkup = ['<div class="title-box-container">', '<div class="title-box-main {DefaultComponentName}48x48">', '<span class="title-box-main-title">{DefaultComponentTitle}: {Description}</span>', '<br>', '<span class="title-box-subtitle {CurrentComponentName}16x16">', '{CurrentComponentTitle}', '</span>', '</div>', '</div>'];

        this.titleTemplate = new Ext.Template(titleTemplateMarkup);
		
        this.topPanel = new Ext.Panel(
        {
            layout: 'border',
            height: 85,
            tbar: new Ext.Toolbar(
            {
                style: 'position:inherit',
                items: [                
				{
                    id: 'jewel-menu',
                    text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                    ctCls: 'jewel-menu-container',
                    iconCls: 'jewel-menu',
                    arrowAlign: 'bottom',
                    menu: 
                    {
                        items: [
                        {
                            text: 'New'
                        }, 
                        {
                            text: 'Save'
                        }, 
                        {
                            text: 'Close'
                        }]
                    }
                }, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
                this.tbar,                
                '->',
				{
					text: 'Workflow',
					iconCls: 'workflow',
					handler: this.showWorkFlow,
					scope: this
				},
                {
                    text: 'Help',
                    iconCls: 'help'
                }]
        }),
        items: [
            {
                id: 'title-box',
                region: 'center',
                baseCls: 'x-plain',
                ///style: 'background-color:#DFE8F',
                hideBorders: true,
                html: ''
            }]
    });
},
initBottomPanel: function()
    {
		this.statusLabel = new Ext.Toolbar.TextItem('');
    	this.userLabel = new Ext.Toolbar.TextItem('');
		
		this.bottomPanel = new Ext.ux.StatusBar(
        {
            id: 'form-statusbar',
            defaultText: '',
			statusAlign:'right',
            plugins: new Ext.ux.ValidationStatus(
            {
                form: 'form-panel'
            }),
			items: [this.statusLabel,
			'->', '-', this.userLabel]
        });
    },
updateTitle: function()
    {
        var titleBox = Ext.getCmp('title-box');
        
        this.titleTemplate.overwrite(titleBox.body, 
        {
            DefaultComponentTitle: this.title,
            DefaultComponentName: 'dynamicentity',
            Description: this.description,
            CurrentComponentTitle: 'Information',
            CurrentComponentName: 'dynamicentity'
        });
    },
	showWorkFlow: function()
	{
		window.showModalDialog("../help/" + this.outlinePanel.getDefaultComponentNode().attributes.component + "/workflow.htm");		
	},
    setDescription: function(description)
    {
        this.description = description;
        
        this.updateTitle();
    },
	setRecord: function(record)
	{
		this.currentRecord = record;
		
		this.updateMenu();
		if(this.statusProperty != null)
		{
			var sb = Ext.getCmp('form-statusbar');
			Ext.fly(this.statusLabel.getEl()).update("<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>");
			/*sb.setStatus(
			{
                text: "<b>Status:&nbsp;" + record.data[this.statusProperty] + "</b>",
                //iconCls: 'x-status-error',
                clear: false // auto-clear after a set interval
            });*/
		}	
	},
	setUser: function(value)
	{
		if(value != null)
		{
			Ext.fly(this.userLabel.getEl()).update("<b>User:&nbsp;" + value + "</b>");
		}
			
	},
initMenuPanel: function (config) {
    componentViewer = this;

    //this.menuPanel = config.menu;
}
});