/**
 * @author gbritton
 */
Ext.override(Ext.form.Action.Submit, 
{
    // private
    run: function()
    {
        var o = this.options, method = this.getMethod(), isGet = method == 'GET';
        if (o.clientValidation === false || this.form.isValid()) 
        {
            if (o.submitEmptyText === false) 
            {
                var fields = this.form.items, emptyFields = [];
                fields.each(function(f)
                {
                    if (f.el.getValue() == f.emptyText) 
                    {
                        emptyFields.push(f);
                        f.el.dom.value = "";
                    }
                });
            }
            Ext.Ajax.request(Ext.apply(this.createCallback(o), 
            {
                //form:this.form.el.dom, Greivin: Comente esta linea para que no envie los campos que tiene el formulario
                url: this.getUrl(isGet),
                method: method,
                headers: o.headers,
                //params:!isGet ? this.getParams() : null, //Si envio los parametros en params se envian como un string.
                jsonData: !isGet ? this.getParams() : null,
                isUpload: this.form.fileUpload
            }));
            if (o.submitEmptyText === false) 
            {
                Ext.each(emptyFields, function(f)
                {
                    if (f.applyEmptyText) 
                    {
                        f.applyEmptyText();
                    }
                });
            }
        }
        else 
            if (o.clientValidation !== false) 
            { // client validation failed
                this.failureType = Ext.form.Action.CLIENT_INVALID;
                this.form.afterAction(this, false);
            }
    },
    /**
     * Se hace un override porque se quiere mandar un error desde el servidor pero sin disparar una excepcion
     * por lo que ahora si el success es false entonces se marca como error.
     * @param {Object} response
     */
    // private	
    success: function(response)
    {
        var result = this.processResponse(response);
        //if (result === true || result.success)
        
        //if (result === true && result.success)
        if (result.success) 
        {
            this.form.afterAction(this, true);
            return;
        }
        if (result.errors) 
        {
            this.form.markInvalid(result.errors);
        }
        this.failureType = Ext.form.Action.SERVER_INVALID;
        this.form.afterAction(this, false);
    }
    
});

Ext.override(Ext.form.Action.Load, 
{
    run: function()
    {
        Ext.Ajax.request(Ext.apply(this.createCallback(this.options), 
        {
            method: this.getMethod(),
            url: this.getUrl(false),
            headers: this.options.headers,
            //params:this.getParams()
            jsonData: this.getParams()
        }));
    }
});

Ext.override(Ext.form.Action, 
{
    getParams: function()
    {
        var bp = this.form.baseParams;
        var p = this.options.params;
        
        p = Ext.applyIf(p, bp); //This line is a hack: Greivin Britton 19-06-2010
        //Todas las lineas comentariadas son parte del codigo original pero el problema con ellas es 
        //que envian los parametros como un string.		
        /*if(p){
         if(typeof p == "object"){
         p = Ext.urlEncode(Ext.applyIf(p, bp));
         }else if(typeof p == 'string' && bp){
         p += '&' + Ext.urlEncode(bp);
         }
         }else if(bp){
         p = Ext.urlEncode(bp);
         }*/
        return p;
    }
});

Ext.override(Ext.data.HttpProxy, 
{
    /**
     * HttpProxy implementation of DataProxy#doRequest
     * @param {String} action The crud action type (create, read, update, destroy)
     * @param {Ext.data.Record/Ext.data.Record[]} rs If action is load, rs will be null
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Ext.data.DataReader} reader The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback
     * <div class="sub-desc"><p>A function to be called after the request.
     * The <tt>callback</tt> is passed the following arguments:<ul>
     * <li><tt>r</tt> : Ext.data.Record[] The block of Ext.data.Records.</li>
     * <li><tt>options</tt>: Options object from the action request</li>
     * <li><tt>success</tt>: Boolean success indicator</li></ul></p></div>
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback function is executed. Defaults to the browser window.
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     * @protected
     */
    doRequest: function(action, rs, params, reader, cb, scope, arg)
    {
        var o = 
        {
            method: (this.api[action]) ? this.api[action]['method'] : undefined,
            request: 
            {
                callback: cb,
                scope: scope,
                arg: arg
            },
            reader: reader,
            callback: this.createCallback(action, rs),
            scope: this
        };
        
        // If possible, transmit data using jsonData || xmlData on Ext.Ajax.request (An installed DataWriter would have written it there.).
        // Use std HTTP params otherwise.
        if (params.jsonData) 
        {
            o.jsonData = params.jsonData;
        }
        else 
            if (params.xmlData) 
            {
                o.xmlData = params.xmlData;
            }
            else 
            {
                //o.params = params || {}; Hack, los parametros se deben enviar siempre como o.jsonData
                o.jsonData = params ||
                                {};
            }
        
        // Set the connection url.  If this.conn.url is not null here,
        // the user must have overridden the url during a beforewrite/beforeload event-handler.
        // this.conn.url is nullified after each request.
        this.conn.url = this.buildUrl(action, rs);
        
        if (this.useAjax) 
        {
        
            Ext.applyIf(o, this.conn);
            
            // If a currently running request is found for this action, abort it.
            if (this.activeRequest[action]) 
            {
                ////
                // Disabled aborting activeRequest while implementing REST.  activeRequest[action] will have to become an array
                // TODO ideas anyone?
                //
                //Ext.Ajax.abort(this.activeRequest[action]);
            }
            this.activeRequest[action] = Ext.Ajax.request(o);
        }
        else 
        {
            this.conn.request(o);
        }
        // request is sent, nullify the connection url in preparation for the next request
        this.conn.url = null;
    }
});

var JsonTreeLoader = Ext.extend(Ext.tree.TreeLoader, 
{
    requestData: function(node, callback)
    {
        if (this.fireEvent("beforeload", this, node, callback) !== false) 
        {
            this.transId = Ext.Ajax.request(
            {
                method: this.requestMethod,
                url: this.dataUrl || this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: 
                {
                    callback: callback,
                    node: node
                },
                //params      : this.getParams(node),//this.getParams(node),
                //jsonData: this.jsonData || {},
                jsonData: this.baseParams ||
                                {},
                headers: 
                {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
        }
        else 
        {
            // if the load is cancelled, make sure we notify
            // the node that we are done
            if (typeof callback == "function") 
            {
                callback();
            }
        }
    },
    processResponse: function(response, node, callback, scope)
    {
        var json = response.responseText;
        try 
        {
            var j = Ext.decode(json);
            j = j.d || j;
            var o = response.responseData || j;
            node.beginUpdate();
            
            for (var i = 0, len = o.length; i < len; i++) 
            {
                var n = this.createNode(o[i]);
                if (n) 
                {
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
        } 
        catch (e) 
        {
            this.handleFailure(response);
        }
    }
});

/*Ext.override(Ext.form.Field, 
{
	/**
	 * Esta funcion tiene que ser llamada despues de hacer doLayout y antes de remover el field de un contenedor
	 * @param {Object} text
	 */
	/*setLabel: function(text)
	{
		this.getEl().up('.x-form-item').dom.childNodes[0].innerHTML = text;	
	},
    /**
     * Show the container including the label
     */
    /*showContainer: function()
    {
        this.enable();
        this.show();
        
        if (!Ext.isEmpty(this.getEl())) 
        {
            this.getEl().up('.x-form-item').setDisplayed(true); // show entire container and children (including label if applicable)
        }
    },
    /**
     * Hide the container including the label
     */
    /*hideContainer: function()
    {
        this.disable(); // for validation
        this.hide();
        
        if (!Ext.isEmpty(this.getEl())) 
        {
            this.getEl().up('.x-form-item').setDisplayed(false); // hide container and children (including label if applicable)
        }
    },
    /**
     * Hide / Show the container including the label
     * @param visible
     */
    /*setContainerVisible: function(visible)
    {
        if (this.rendered) 
        {
            if (visible) 
            {
                this.showContainer();
            }
            else 
            {
                this.hideContainer();
            }
        }
        
        return this;
    }    
});*/

Ext.override(Ext.form.Field, {
    onRender : function(ct, position){
        if(!this.el){
            var cfg = this.getAutoCreate();

            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
			
			if(this.tooltip){
                cfg['ext:qtip'] = this.tooltip.tip;
                cfg['ext:qwidth'] = this.tooltip.width || 100;
            }
			
            this.autoEl = cfg;
        }
        Ext.form.Field.superclass.onRender.call(this, ct, position);
        if(this.submitValue === false){
            this.el.dom.removeAttribute('name');
        }
        var type = this.el.dom.type;
        if(type){
            if(type == 'password'){
                type = 'text';
            }
            this.el.addClass('x-form-'+type);
        }
        if(this.readOnly){
            this.setReadOnly(true);
        }
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }

        this.el.addClass([this.fieldClass, this.cls]);
    },
});

Ext.override(Ext.form.Field, {
    setFieldLabel: function(text) {
        if (this.rendered) {
            var labelSeparator = this.labelSeparator;
 
            if (typeof labelSeparator == 'undefined') {
                if (this.ownerCt && this.ownerCt.layout && typeof this.ownerCt.layout.labelSeparator != 'undefined')
                    labelSeparator = this.ownerCt.layout.labelSeparator;
                else
                    labelSeparator = '';
            }
 
            var formItem = this.el.up('.x-form-item', 10);
 
            if (formItem) {
                var label = formItem.child('.x-form-item-label');
 
                if (label)
                    label.update(text + labelSeparator);
            }
        } else
            this.fieldLabel = text;
    }
});

Ext.ux.IFrame = Ext.extend(Ext.Panel,
{
    layout: 'fit',
	url: null,
	urlTemplate: null,
	initComponent: function()
    {	
        Ext.ux.IFrame.superclass.initComponent.call(this);
       
	    if(this.url != null) 
        	this.loadComponent(this.url);
    },
	setURL: function(url)
	{
		this.url = url;
		
		this.loadComponent();
	},
    loadComponent: function()
    {
        if (this.url != null && this.url.length > 0) 
        {
            this.mask();
            Ext.Ajax.request(
            {
                url: this.url,
                success: function(xhr)
                {
                    try 
                    {
                        this.setComponent(eval(xhr.responseText));                        
                    } 
                    catch (ex) 
                    {
                        alert('Exception ' + ex);
                    }
                    this.unMask();
                },
                failure: function()
                {
                    this.unMask();
                },
				scope: this
            });
        }
    },
    setComponent: function(component)
    {
        try 
        {
			this.removeAll();
            this.add(component);
            this.doLayout();
			//this.ownerCt.doLayout();
			this.setTitle(component.title);
			component.setTitle(null);
			this.fireEvent('componentloaded', this);
        } 
        catch (ex) 
        {
            alert(ex);
        }
    },
    mask: function()
    {
		if(this.getEl()!= null)
        	this.getEl().mask('Loading...');
    },
    unMask: function()
    {
		if(this.getEl() != null)
        	this.getEl().unmask();
    }
});

Ext.reg('iframe', Ext.ux.IFrame);

/**
 * Clase personalizada del Grid panel para que se puedan instanciar unos eventos propios de ella
 * @param {Object} config
 */
Ext.ux.GridPanel = function(config){
    Ext.apply(this, config);
    
    Ext.ux.GridPanel.superclass.constructor.call(this, {});
	
    this.addEvents('datachanged');
};

Ext.extend(Ext.ux.GridPanel, Ext.grid.GridPanel, {
    
});

/**
 * Igual que la clase anterior solo que esta herada del EditorGridPanel
 * @param {Object} config
 */
Ext.ux.EditorGridPanel = function(config){
    Ext.apply(this, config);
    
    Ext.ux.EditorGridPanel.superclass.constructor.call(this, {});
	
    this.addEvents('datachanged');
};

Ext.extend(Ext.ux.EditorGridPanel, Ext.grid.EditorGridPanel, {
    
});