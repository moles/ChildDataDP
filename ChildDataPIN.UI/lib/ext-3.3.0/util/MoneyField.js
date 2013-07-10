Ext.namespace('Ext.ux');
Ext.util.Format.usMoneyNull = function(v, cents, currencySymbol) {
    if (v === null || v === '') 
    {
        return '';
    }
    else 
        if (v > 999999999999) 
        {
            return '';
        }
        else 
        {
            v = Math.round((v - 0) * 100) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split('.');
            var whole = ps[0];
            var sub = ps[1] ? '.' + ps[1] : '.00';
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) 
            {
                whole = whole.replace(r, '$1' + ',' + '$2');
            }
            v = (cents) ? whole + sub : whole;
            if (v.charAt(0) == '-') 
            {
                return '-' + currencySymbol + v.substr(1);
            }
            return currencySymbol + ' ' + v;
        }
};
Ext.ux.MoneyField = function(config) {
    var defaultConfig = 
    {
        allowDecimals: true,
        allowNegative: false,
        decimalPrecision: 2,
        maxValue: 999999999999,
        minValue: 0,
        selectOnFocus: true,
        value: null,
        currencySymbol: '$',
        itemCls: 'rmoney',
        handleRecord: true,
        currencySymbolProperty: null,
        style: 'text-align:right;'
    };
    if (config.readOnly) 
        config.cls = 'x-form-item-readonly';
    Ext.ux.MoneyField.superclass.constructor.call(this, Ext.apply(defaultConfig, config));
    this.on('change', this._onChange, this);
    this.on('focus', this._onFocus);
    this.on('blur', this._onBlur);
    this.on('render', this._onRender);
    this.dollarNumericValue = config.value || null;
    this.currencySymbol = config.currencySymbol || defaultConfig.currencySymbol;
};
Ext.extend(Ext.ux.MoneyField, Ext.form.NumberField, 
{
    dollarNumericValue: null,
    currencySymbol: null,
    initSelf: function() {
        if (this.value === null || this.value === '') 
        {
            this.dollarNumericValue = null;
        }
        else 
        {
            this.dollarNumericValue = this.value;
        }
        this.setRawValue(this.formatter(this.dollarNumericValue));
        this.originalValue = this.dollarNumericValue;
    },
    setValue: function(v) {
        Ext.ux.MoneyField.superclass.setValue.call(this, v);
        this._onBlur(this);
    },
    clearValue: function() {
        this.clearInvalid();
        this.setRawValue('');
        this.dollarNumericValue = null;
    },
    setRecord: function(r) {
        if (r != null) 
        {
            this.setValue(r.get(this.name));
            if (this.currencySymbolProperty != null && this.currencySymbolProperty.length > 0) 
            {
                var symbol = r.get(this.currencySymbolProperty);
                if (symbol != null && symbol.length > 0) 
                    this.setCurrencySymbol(symbol);
            }
        }
    },
	/*setSymbol:function(symbol){		
	   this.currencySymbol = symbol;
	   alert(this.currencySymbol);
	   if (this.dollarNumericValue == null && this.value != null) 
            this.dollarNumericValue = this.value;
        if (this.rendered) 
            this.setRawValue(this.formatter(this.dollarNumericValue));
	}
	,*/
    setCurrencySymbol: function(currencySymbol) {
        this.currencySymbol = currencySymbol;
        if (this.dollarNumericValue == null && this.value != null) 
            this.dollarNumericValue = this.value;
        if (this.rendered) 
            this.setRawValue(this.formatter(this.dollarNumericValue));
    },
    getValue: function() {
        if (this.value === '' || this.value === null) 
        {
            return null;
        }
        else 
            if (isNaN(this.value)) 
            {
                this.value = 0;
            }
            else 
            {
                return Number(this.value);
            }
    },
    _onChange: function(field, newVal, oldVal) {
        if (newVal === '') 
        {
            this.dollarNumericValue = null;
        }
        else 
        {
            this.dollarNumericValue = newVal - 0;
        }
    },
    _onBeforeAction: function(form, action) {
        this.setRawValue(this.getValue());
    },
    _onRender: function(cmp) {
        this.setRawValue(this.formatter(this.dollarNumericValue));
        var parentForm = null;
        if (this.isFormField && (parentForm = this.findParentByType('form'))) 
        {
            parentForm.on('actioncomplete', function() {
                cmp.initSelf();
            });
            parentForm.on('actionfailed', function() {
                cmp.initSelf();
            });
            parentForm.on('afterLayout', function() {
                cmp.initSelf();
            });
            parentForm.on('beforeaction', this._onBeforeAction, this);
        }
        else 
            cmp.initSelf();
    },
    formatter: function(value) {
        var showCents = (this.decimalPrecision !== 0);
        if (value === 0) 
        {
            return Ext.util.Format.usMoneyNull("0", showCents, this.currencySymbol);
        }
        else 
        {
            return Ext.util.Format.usMoneyNull(value, showCents, this.currencySymbol);
        }
    },
    beforeBlur: function() {
        var v = this.parseValue(this.getRawValue());
        this.setValue(this.fixPrecision(v));
    },
    _onBlur: function(field) {
        if (this.rendered) 
            if (field.getRawValue().substring(0, this.currencySymbol.length) != this.currencySymbol.trim()) 
            {
                if (field.getRawValue() === '') 
                {
                    this.dollarNumericValue = null;
                }
                else 
                {
                    this.dollarNumericValue = field.getRawValue() - 0;
                }
                this.setRawValue(this.formatter(this.dollarNumericValue));
            }
    },
    _onFocus: function(field) {
        if (this.dollarNumericValue === null || this.dollarNumericValue === '') 
        {
            if (field.getValue() == '') 
            {
                field.setRawValue('');
            }
        }
        else 
        {
            field.setRawValue((this.dollarNumericValue - 0).toFixed(this.decimalPrecision));
        }
    },
    processValue: function(value) {
        return value;
    },
    validateValue: function(value) {
        value = value.replace(this.currencySymbol + ' ', '').replace(',', '');
        if (!Ext.form.NumberField.superclass.validateValue.call(this, value)) 
        {
            return false;
        }
        if (value.length < 1) 
        {
            return true;
        }
        value = Number(this.value);
        if (isNaN(value)) 
        {
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        var num = this.parseValue(value);
        if (num < this.minValue) 
        {
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if (num > this.maxValue) 
        {
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },
    initAllSiblings: function() {
        if (this.isFormField) 
        {
            var parentForm = this.findParentByType('form');
            var dollarFields = parentForm.findByType('moneyfield');
            Ext.each(dollarFields, function(dollarfield) {
                dollarfield.initSelf();
            });
        }
    },
    clearDirty: function() {
        this.originalValue = this.getRawValue();
    }
});
Ext.reg('moneyfield', Ext.ux.MoneyField);
