Ext.util.EmptyGuid = "00000000-0000-0000-0000-000000000000";

Ext.util.BankStatusEnum = 
{
    Active: '1',
    Inactive: '2'
};
Ext.util.getMicrosoftAjaxDate = function(date)
{
    if (date != null && date != "") 
        return '\/Date(' + date.getTime() + '+0000)\/';
    else 
        return null;
};

Ext.util.PaymentType = 
{
    Wire: '94406FF3-CB4C-49F1-976B-AA5D3A0AC905',
    Check: 'D646EF0B-BEBC-4C7B-BAF3-07D7066C0633',
    Cash: '962DF6E8-AAD2-45A7-998B-55C6E415F8B6'
};

Ext.util.DeliveryMethod = 
{
	Mail : '9CA4EE7B-0D3A-444B-A043-2331167F46BA',
	InPerson: 'AA116D44-9728-4102-A50C-4B2EBFA830CC',
	ThirdPartyDelivery: 'CB1FF2CA-E7F9-43E5-A374-ACF7689B6AB2'	
};

/**
 * Format a number as currency 0,000.00
 * @param {String} symbol
 * @param {Number/String} v
 * @return {String} The formatted currency string
 */
Ext.util.MoneyFormat = function(symbol, v){
	v = (Math.round((v-0)*100))/100;
    v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
    v = String(v);
    var ps = v.split('.'),
        whole = ps[0],
        sub = ps[1] ? '.'+ ps[1] : '.00',
        r = /(\d+)(\d{3})/;
    while (r.test(whole)) {
        whole = whole.replace(r, '$1' + ',' + '$2');
    }
    v = whole + sub;
    if (v.charAt(0) == '-') {
        return  '-' + symbol + ' ' + v.substr(1);
    }
    return symbol + ' ' +  v;
};

/**
 * Todos los metodos de los web services que sean de creacion o actualizacion deberan retornar la entidad en la propiedad entity.
 * Asi sera mas facil decodificar todas las respuestas.
 * @param {Object} action
 */
Ext.util.getRecordByAction = function(action)
{
    var methodResult = Ext.util.JSON.decode(action.response.responseText);
    
    var entity = methodResult.entity;
    
    return new Ext.data.Record(entity);
};

/**
 * URL to be open in a new tab or new window depending browser's configuration.
 * @param {String} url
 */
Ext.util.openWindow = function openWindow(url, width, height)
{
    var popupOptions = "center=yes,location=yes,status=yes,resizable=yes,scrollbars=yes,width=" + getWidth() + ",height=" + (height > 0 ? height : getHeight()) + ",top=" + ((getHeight() - (getHeight() - 50)) / 2) + ",left=0";
    var result = window.open(url, "_blank", "");
};

/**
 * URL to be open in a Popup
 * @param {String} url
 */
Ext.util.showModalDialog = function(url, width, height)
{
   	width = (width != null && width > 0) ? width : 500
	height = (height != null && height > 0) ?  height: 400;
	
	var dialogLeft = (document.documentElement.clientWidth - width)/2;
	var dialogTop = (document.documentElement.clientHeight - height)/2;
	
	var popupOptions = "location:yes;status:yes;resizable:yes;scrollbars:yes;dialogWidth:" + width + "px;dialogHeight:" + height + "px;center:yes;dialogLeft:" + dialogLeft + "px;dialogTop:" + dialogTop + "px;";
	
	return window.showModalDialog(url, "", popupOptions);
};

function getWidth(width)
{
	if(width == null || width == 0)
		width = window.innerWidth;
		
    return window.innerWidth != null ? (window.innerWidth - width ) / 2: document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
}

function getHeight()
{
    return window.innerHeight != null ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ? document.body.clientHeight : null;
}

/**
 *
 */
Ext.util.isValidString = function(value)
{
    return value != null && value.toString().trim().length > 0;
};

Ext.util.convertToCurrency = function(amount, exchangeRate, operator)
{
    return (operator == '*' ? amount * exchangeRate : amount / exchangeRate);
};

/**
 * Hace falta agregar "&& parseFloat(v) != NaN"
 * @param v, valor que se esta intenando obtener como un float
 * @type {Float}
 * @param defaultValue, valor que se utilizara para retornar en caso que v no sea un float.
 * @type {Float}
 */
Ext.util.getFloat = function(v, defaultValue)
{
    if (v != null && v.toString().trim() != '' && (v >= 0 || v < 0)) 
        return v;
    else 
        return defaultValue;
};

/**
 * Date that comes in format
 * @param {String} value "/Date(78664146456)/"
 */
Ext.util.getFormattedDate = function(value)
{
    if (value != "" && value != null) 
    {
        if (value.toString().indexOf("/") != -1) 
        {
            value = value.replace("/", "").replace("/", "");
            value = "new " + value;
            
            return eval(value).dateFormat('M j, Y');
        }
        else 
            return value.dateFormat('M j, Y');
    }
    else 
        return value;
  };

Ext.util.getDate = function(value)
{
    if (value != "" && value != null && value.toString().indexOf("/") != -1) 
    {
        value = value.replace("/", "").replace("/", "");
        value = "new " + value;
        
        return eval(value);
    }
    else 
        return value;
  };
  
  Ext.util.renderYesNo = function (v) {
    return (v ? 'Yes' : 'No');
  };

Ext.util.getForm = function()
{
	return new Ext.form.BasicForm(Ext.util.createForm(), {});		
};

Ext.util.createForm = function()
{
	var globalForm = Ext.get("generalForm");//Se lee un formulario global	
	
	if(globalForm == null)
	{
		globalForm = document.body.createElement('form');
		
		globalForm.createAttribute('id') = 'generalForm';
		globalForm.createAttribute('method') = 'POST';
	}			
	return globalForm;
};

Ext.util.serialize = function (_obj) {
    // Let Gecko browsers do this the easy way
    if (typeof _obj.toSource !== 'undefined' && typeof _obj.callee === 'undefined') {
        return _obj.toSource();
    }

    // Other browsers must do it the hard way
    switch (typeof _obj) {
        // numbers, booleans, and functions are trivial: 
        // just return the object itself since its default .toString() 
        // gives us exactly what we want 
        case 'number':
        case 'boolean':
        case 'function':
            return _obj;
            break;

        // for JSON format, strings need to be wrapped in quotes 
        case 'string':
            return '\'' + _obj + '\'';
            break;

        case 'object':
            var str;
            if (_obj.constructor === Array || typeof _obj.callee !== 'undefined') {
                str = '[';
                var i, len = _obj.length;
                for (i = 0; i < len - 1; i++) { str += serialize(_obj[i]) + ','; }
                str += serialize(_obj[i]) + ']';
            }
            else {
                str = '{';
                var key;
                for (key in _obj) { str += key + ':' + serialize(_obj[key]) + ','; }
                str = str.replace(/\,$/, '') + '}';
            }
            return str;
            break;

        default:
            return 'UNKNOWN';
            break;
    }
};