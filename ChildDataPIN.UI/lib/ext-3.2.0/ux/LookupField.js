/**
 * Developed by Greivin Britton Chavarria
 * @Version 1.1
 * Cuando el usuario escribe en el campo de text y selecciona un registro
 * automaticamente se debe asignar un valor pero si ya estaba seleccionado
 * un valor en el momento que el usuario empieza a escribir se tiene que eliminar
 * ese valor. Si el usuario escribe un texto y deja el campo sin seleccionar
 * el elemento de la tabla entonces se debe verificar si el hay un item
 * que haga match con lo que el usuario escribio y si es asi asignar el valor
 * de lo contrario se debe eliminar lo que el usuario escriba y mas adelante
 * se marcara el campo como invalido.
 * Si el usuario selecciona un elemento desde el boton de busqueda no se debe
 * cargar data store.
 * El trigger para remover el valor solo debe estar visible cuando este asignado el
 * valor del combobox con el metodo setValue
 */
Ext.ns('Ext.ux');
Ext.ux.LookupField = Ext.extend(Ext.form.ComboBox, 
{
    /**
     * Por defecto este campo esta habilitado para que el usuario seleccione un valor o elimine el que esta.
     * @property readOnly
     * @type {Boolean}
     */
    readOnly: false,
    /**
     * Private. El valor de esta propiedad se inicializa en 0 para que el usuario no pueda escribir nada
     * cuando se habilite la funcionalidad de busqueda desde el texto se debera quitar.
     * @property maxLengthText
     * @type {Integer}
     */
    maxLengthText: 1,
    /**
     * Esta clase es la que le da la apariencia de un link al texto.
     * Eta clase puede ser encontrada en el component-viewer.css
     * @property cls
     * @type {String}
     */
    cls: 'x-form-lookup-field',
    /**
     * No se para que es.
     * @property validationEvent
     * @type {Boolean}
     */
    validationEvent: false,
    /**
     * Valida el campo cuando pierde el focus.
     * @property validateOnBlur
     * @type String
     */
    validateOnBlur: false,
    /**
     * Clase del css para el boton limpiar
     * @property trigger1Class
     * @type {String}
     */
    trigger1Class: 'x-form-clear-trigger',
    //trigger1Class: Ext.form.ComboBox.prototype.triggerClass,
    /**
     * Clase del css para el boton buscar
     * @property trigger2Class
     * @type {String}
     */
    trigger2Class: 'x-form-search-trigger',
    /**
     * Por defecto el boton de limpiar esta oculto y se activa con el enter o con la busqueda si se pone un valor valido.
     * @property hideTrigger1
     * @type {Boolean}
     */
    hideTrigger1: true,
    /**
     * Ancho del componente
     * property: width
     * @type {Integer}
     */
    //width: 180,
    /**
     * Por defecto el campo cuando se crea no tiene un valor por lo tanto no tiene busqueda.
     * @property hasSearch
     * @type {Boolean}
     */
    hasSearch: false,
    /**
     * Esto por el momento no se ocupa porque no se buscan datos escribiendo directamente en el campo
     * pero luego ese feature se pondra para dar una funcionalidad como la del combobox.
     * @property paramName
     * @type: {String}
     */
    paramName: 'query',
    /**
     * Carpeta de donde se debe mandar a cargar la pagina del lookup
     * esta carpeta debe estar en la raiz del proyecto.
     * @property component
     * @type {String}
     */
    component: '',
    /**
     * El nombre del campo que se utilizara internamente como el valor del registro seleccionado de la tabla
     * del lookup, este campo puede ser diferente al campo de donde se cargan los datos una vez que el registro
     * esta guardado en la entidad.
     * @property valueField
     * @type {String}
     */
    valueField: '',
    /**
     * El nombre del campo de donde se tomara el valor que se mostrara en este lookup field del registro
     * que se seleccionado de la tabla de la busqueda.
     * @property displayField
     * @type {String}
     */
    displayField: '',
    /**
     * Campo que se utilizara para tomar el valor que se utilizara como id cuando el registro se carga desde el origen
     * de datos de la entidad y no desde la busqueda.
     * property recordValueField
     * @type {String}
     */
    recordValueField: '',
    /**
     * Campo que se utilizara para tomar el valor que se mostrara cuando el registro se carga desde el origen
     * de datos de la entidad y no desde la busqueda.
     * @property recordDisplayField
     * @type {String}
     */
    recordDisplayField: '',
    baseParams: 
    {},
    /**
     * Default value for this property because known issues with hidden panels.
     * property hideMode
     * @type {String}
     */
    focused: false,
    //hideMode: 'offsets',	
    hideMode: 'display',
    queryDelay: 1,
    typeAhead: true,
    mode: 'remote',
    pageSize: 10,
    forceSelection: false,
    triggerAction: 'all',
    userJustStopTyping: false,
    isLoadingData: false,
    handleRecord: true,
    enableLink: true,
    initComponent: function()
    {
        this.triggerConfig = 
        {
            tag: 'span',
            cls: 'x-form-twin-triggers',
            cn: [
            {
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger " + this.trigger1Class
            }, 
            {
                tag: "img",
                src: Ext.BLANK_IMAGE_URL,
                cls: "x-form-trigger " + this.trigger2Class
            }]
        };
        
        this.addClass(this.component + '16x16');
        
        //Estos campos son obligados para que el usuario los especifique.
        if (this.valueField == '' || this.valueField == null) 
            throw Exception('Value Field cannot be null');
        
        if (this.displayField == '' || this.displayField == null) 
            throw Exception('Value Field cannot be null');
        
        //Si el campo id del registro de la entidad es nulo entonces se asigna el valueField
        if (this.recordValueField == null || this.recordValueField == '') 
            this.recordValueField = this.valueField;
        
        //Si el campo a mostrar del registro de la entidad es nulo entonces se asigna el displayField
        if (this.recordDisplayField == null || this.recordDisplayField == '') 
            this.recordDisplayField = this.displayField;
        
        var url = "../" + this.component + "/svc/" + this.component + "Service.svc/RetrieveMultiple";
        var idProperty = this.valueField;
        var fields = [
        {
            name: this.valueField
        }, 
        {
            name: this.displayField
        }];
        
        this.store = new Ext.data.JsonStore(
        {
            url: url,
            root: 'data',
            totalProperty: 'totalCount',
            id: idProperty,
            fields: fields,
            remoteSort: true,
            sortInfo: 
            {
                field: this.displayField,
                direction: "ASC"
            }
        });
        
        this.store.on('beforeload', function()
        {
            isLoadingData = true;
            
            Ext.apply(this.params, this.baseParams);
            this.store.baseParams = this.params;
            
        }, this);
        
        //After the user left the field and if he typed something assign the first record that match the text		
        this.store.on('load', function()
        {
            isLoadingData = false;
            if (this.focused == false && this.hasRawValue()) 
                this.selectFirstRecord();
        }, this);
        
        //mark the field as focused	
        this.on('focus', function()
        {
            this.focused = true;
        }, this);
        
        //has to know when the user is writing in the textfield.
        this.on('keyup', function(f, e)
        {
            this.userJustStopTyping = true;
        }, this);
        
        this.on('specialkey', function(f, e)
        {
            //Solo puede eliminar letra por letra cuando el value es null
            //de lo contrario se limpia todo el campo.
            if (e.getKey() == 8 && this.getValue() != null)//BACKSPACE            
            {
                //No se debe eliminar el Raw value solo se limpia internamente
                this.setLookupValue(null, null);
            }
        }, this);
        
        //Si pierde el focus y el usuario escribio un valor pero no lo ha seleccionado 
        this.on('blur', function(f, e)
        {
            this.userJustStopTyping = false;
            this.focused = false;
            
            //Si no hay un raw value valido entonces se quita el trigger de eliminacion
            if (!this.hasRawValue()) 
                this.triggers[0].hide();
            else 
            {
                var scope = this;
                if (scope.isLoadingData == false) 
                {
                    setTimeout(function()
                    {
                        if (scope.isLoadingData == false && scope.value == null) 
                        
                            scope.selectFirstRecord();
                    }, 30);
                }
            }
        }, this);
        
        this.on('select', function(combo, record, index)
        {
            this.setRecord(record, true);
        }, this);
        
        this.on('render', function()
        {
            var lookupField = this;
            
            this.getEl().dom.onclick = function(e, o)
            {
				var value = lookupField.getValue();
                
                if (value != null && value.length > 0 && lookupField.isValidPosition(lookupField.getEl().dom)) 
                {	
                    var useThisId = (lookupField.linkParams == null || lookupField.linkParams == '') ? '?' + ((lookupField.parameterName == null) ? 'id=' : lookupField.parameterName + '=') + value : '';
                    if (lookupField.enableLink == true) 
                    {
                        Ext.util.openWindow("../" + (lookupField.detailComponent == null || lookupField.detailComponent == '' ? lookupField.component : lookupField.detailComponent) + "/" + (lookupField.page == null || lookupField.page == "" ? "edit" : lookupField.page) + ".aspx" + (lookupField.linkParams != null ? "?" + lookupField.linkParams : useThisId) + (lookupField.linkBaseParams != null && lookupField.linkBaseParams != '' ? '&' + lookupField.linkBaseParams : ''));
                        return true;
                    }
                }
                
                return false;
            }
        }, this);
        
        Ext.ux.LookupField.superclass.initComponent.call(this);
    },
    getTrigger: Ext.form.TwinTriggerField.prototype.getTrigger,
    initTrigger: Ext.form.TwinTriggerField.prototype.initTrigger,
    //onTrigger1Click: Ext.form.ComboBox.prototype.onTriggerClick,
	isValidPosition:function(o)
	{
		var start = this.getSelectionStart(o), end = this.getSelectionEnd(o);
		
		return start <= end && start > 0 && end < o.value.length;
	},	
    getSelectionStart: function(o)
    {
        if (o.createTextRange) 
        {
            var r = document.selection.createRange().duplicate()
            r.moveEnd('character', o.value.length)
            if (r.text == '') 
                return o.value.length
            return o.value.lastIndexOf(r.text)
        }
        else 
            return o.selectionStart
    },
    getSelectionEnd: function(o)
    {
        if (o.createTextRange) 
        {
            var r = document.selection.createRange().duplicate()
            r.moveStart('character', -o.value.length)
            return r.text.length
        }
        else 
            return o.selectionEnd
    },
    /**
     * Se utiliza cuando el usuario deja el campo con algo escrito mientras los
     * datos se estan cargando o cuando el usuario deja el campo y los datos ya estan
     * cargados pero el raw value no es null.
     */
    selectFirstRecord: function()
    {
        this.setRecord(this.store.getAt(0), true);
        
        this.store.removeAll(true);
    },
	setComponent:function(component)
	{
		//Remove previous css
		this.removeClass(this.component + '16x16');
		this.component = component;
		this.addClass(this.component + '16x16');
	},
    /**
     * Indicate if the field has a valid raw value
     */
    hasRawValue: function()
    {
        return this.getRawValue() != null && this.getRawValue().toString().length > 0;
    },
    clear: function()
    {
		this.setLookupValue(null, null);
        this.fireEvent('clear', this);
    },
    /**
     * Metodo que se dispara cuando se da click en la X para limpiar el valor del campo.
     */
    onTrigger1Click: function()
    {
        this.clear();
    },
    /**
     * Metodo para levantar la pagina con la tabla de busqueda de registros.
     */
    onTrigger2Click: function()
    {
        if (this.readOnly != true) 
        {
        
            if (this.component == '') 
            {
                alert('You must specify the component of this Lookup Field.');
                
                return;
            }
            
			window.lookupField = 
            {};
			
            window.lookupField.params = this.params;
            
            var result = Ext.util.showModalDialog("../" + this.component + "/lookup.aspx" + (this.querystring != undefined && this.querystring != '' ? '?' + this.querystring : ''), "", 800, 350);
            
            if (result != null) 
            {
                this.fireEvent('select', this, new Ext.data.Record(result), 0); //When user select a record using the popup window the index will be zero.
            }
        }
    },
    /**
     * Este metodo carga los datos del campo ya sea desde la busqueda o desde el registro de la entidad.
     * El recordLookup indica si ese record se envia por una busqueda del usuario o por la lista desplegable.
     * Cuando se asignan los valores se dispara el evento {Event} recordchanged
     * @param {Ext.data.Record} r
     * @param {Boolean} recordLookup
     */
    setRecord: function(r, recordLookup)
    {
        this.record = r;
        
        if (r != null) 
        {
            this.recordLookup = (recordLookup || false);
            
            if (!recordLookup) 
            {
                this.setLookupValue(r.get(this.recordValueField), r.get(this.recordDisplayField));
            }
            else 
            {
                this.setLookupValue(r.get(this.valueField), r.get(this.displayField));
            }
        }
        else 
            this.setLookupValue(null, null);
        
        this.fireEvent('recordchanged', this, this.record);
    },
    /**
     * Si el record se asigno por una busqueda el valor se encontrar por medio de fieldFromPopupLookup pero si el registro se asigna,
     * por la carga de un formlario, una tabla, etc, entonces haciendo un lookup.setRecord() entonces se ocupara el fieldFromExternalRecord
     * @param {String} fieldFromPopupLookup
     * @param {String} fieldFromExternalRecord
     */
    getFieldFromRecord: function(fieldFromPopupLookup, fieldFromExternalRecord)
    {
        var value;
        
        if (this.record != null) 
        {
            if ((value = record.get(fieldFromPopupLookup)) == null && fieldFromExternalRecord != null && fieldFromExternalRecord.length > 0) 
                value = record.get(fieldFromExternalRecord);
        }
        
        return value;
    },
    /**
     * Metodo que asigna el valor para mostrar y el valor interno del campo ya sea que venga de una busqueda
     * o desde el registro de la entidad.
     * Si se pone primer el setValue y luego el setRawValue sabremos cuando un un lookup field no tiene id.
     * Cuando se asignan los valores se dispara el evento {Event} valuechanged.
     * @param {Object} fieldValue
     * @param {Object} displayValue
     */
    setLookupValue: function(fieldValue, displayValue)
    {
        if (!(displayValue != null && displayValue.toString().length > 0 && fieldValue != null && fieldValue.toString().length > 0)) 
        {
            fieldValue = null;
            displayValue = null;
        }
        
        //This will be RawValue
        Ext.ux.LookupField.superclass.setValue.call(this, displayValue);
        
        this.setValue(fieldValue, true);
    },
    setValue: function(value, valid)
    {
        //Solo se va a asignar el value si viene el segundo parametro osea si es manejado desde adentro.
        //De lo contrario no.
        if (valid) 
            this.value = value;
        
        this.processValue(this.value);
        
        this.hasSearch = this.value != null && this.value.toString().length > 0;
        
        if (this.hasSearch) 
            this.triggers[0].show();
        else 
            this.triggers[0].hide();
        
        
        
        return this;
    }
});
Ext.reg('lookupfield', Ext.ux.LookupField);
