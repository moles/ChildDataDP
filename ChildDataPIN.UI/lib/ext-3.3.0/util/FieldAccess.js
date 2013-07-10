/**
 * @author Greivin
 */
Ext.ns("Ext.util");

/**
 * @class Ext.util.FieldAccess
 * <p>A plugin for Field Components with an access type and readOnly control
 * <p>Usage:</p>
 * <pre><code>
 {
 xtype: 'combo',
 plugins: [ Ext.util.FieldAccess ],
 fieldAccess:'restricted',//or readOnly or locked
 triggerAction: 'all',
 fieldLabel: 'Select type',
 store: typeStore
 }
 * </code></pre>
 */
Ext.util.FieldAccess = (function()
{
    return {
        //      Add behaviour at important points in the Field's lifecycle.
        init: function(f)
        {
            f.onRender = f.onRender.createSequence(this.onRender);
            
            f.setAccess = this.setAccess;
        },
        onRender: function()
        {
            this.isCheckBox = this.getXTypes().indexOf('checkbox') != -1;
            
            //para mayor seguridad se verifica si es restricted o readOnly y se configura desde aqui
            if (!this.isCheckBox) 
            {
                this.setReadOnly(this.fieldAccess == 'restricted' || this.fieldAccess == 'readOnly' || this.fieldAccess == 'locked');
                
                if (this.rendered) 
                {
                    var container = this.el.up('.x-form-element', 3);
                    
                    if (this.fieldAccess == 'restricted') 
					{
                        container.addClass('x-form-item-restricted');
						this.addClass('x-form-input-restricted');						
					}
                    else 
                        if (this.fieldAccess == 'readOnly') 
                            container.addClass('x-form-item-readonly');
                        else 
                            if (this.fieldAccess == 'locked') 
                                container.addClass('x-form-item-locked');
                }
            }
            else 
                this.disable();
            
            //set asigna la funcion del plugin para que pueda ser llamada desde afuera como una funcion mas del field.
        },
        /**
         * El tipo de acceso solo puede ser cambiado cuando el valor inicial sea diferente de restricted y readOnly
         * @param {String} fieldAccess
         */
        setAccess: function(fieldAccess)
        {
            //Solo si es diferente de esos dos tipos de accesos de lo contrario no se le puede hacer ninguna modificacion al field.
            if (this.fieldAccess != 'restricted' && this.fieldAccess != 'readOnly') 
            {
                if (!this.isCheckBox) 
                {
					//Jose luis descometaria estas dos lineas para empezar a probar
                    //if (this.name == 'LocalExchangeRate') 
                        //alert(Ext.util.JSON.encode(this.getSize()));
                    
                    this.setReadOnly(fieldAccess == 'locked');
                    
                    if (this.rendered) 
                    {
                        var container = this.el.up('.x-form-element', 3);
                        
                        if (fieldAccess == 'locked') 
                            container.addClass('x-form-item-locked');
                        else 
                            container.removeClass('x-form-item-locked');
                        
                        //Esto podria hacer que la pantalla tarde en renderizar.
                        this.syncSize();
                    }
                }
                else 
                    this.setDisabled(fieldAccess == 'locked');
                
            }
        }
    };
})();
