Ext.apply(Function.prototype, {
    initializeBase: function(instance, baseArguments) {
    },
    registerClass: function(typeName, baseType, interfaceTypes) {
        if (baseType) { Ext.apply(this.prototype, baseType.prototype); }
    },
    registerEnum: function(name, flags) {
    }
});

// Add Type and Type.registerNamespace
Ext.namespace("Type");
Type.registerNamespace = Ext.namespace;

// Create the Sys.Net.WebServiceProxy object
Ext.namespace("Sys.Net");
Sys.Net.WebServiceProxy = function() {};
Sys.Net.WebServiceProxy._generateTypedConstructor = function(type) {
    return function(properties) {
        if (properties) {
            for (var name in properties) {
                this[name] = properties[name];
            }
        }
        this.__type = type;
    };
};
Ext.apply(Sys.Net.WebServiceProxy.prototype, {
    //this._invoke(this._get_path(), 'getCustomers', true, {}, succeededCallback, failedCallback, userContext);
    _invoke: function (path, action, useGet, params, onSuccess, onFailure, userContext) {
        //alert(onSuccess);
        // Use Ext.Ajax to perform the xhr call

        /*Ext.Ajax.request(Ext.apply(userContext.createCallback(userContext.options), {
        url: path + "/" + action,
        method: useGet ? "get" : "post",
        jsonData: params,
        success: onSuccess,
        failure: onFailure,
        scope: userContext
        }));*/
        
        Ext.Ajax.request({
            url: path + "/" + action,
            method: useGet ? "get" : "post",
            jsonData: params,
            success: onSuccess,
            failure: onFailure,
            scope: userContext
        });


        /*return {
        url: path + "/" + action,
        method: useGet ? "get" : "post",
        jsonData: params,
        success: onSuccess,
        failure: onFailure,
        scope: userContext
        };*/
    },
    set_path: function (path) {
        this._path = path;
    },
    get_path: function () {
        return this._path;
    }
});