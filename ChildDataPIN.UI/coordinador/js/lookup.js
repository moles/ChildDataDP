var paging = null;
var search = null;

var entityService = '../catalogo/svc/CatalogoSVC.svc';
var url = entityService + '/TraerMultiples';

var idProperty = "CashierId";
var fields = [
{ name: 'id' },
{ name: 'nombre' },
{ name: 'codigo' },
{ name: 'activo' },
{ name: 'regpor' },
{ name: 'regen' },
{ name: 'regel' },
{ name: 'actel' },
{ name: 'actpor' },
{ name: 'acten' }
];

var dsCashier = new Ext.data.JsonStore(
{
    url: url,
    root: 'data',
    totalProperty: 'totalCount',
    id: idProperty,
    fields: fields,
    remoteSort: true,
    sortInfo: 
    {
        field: "nombre",
        direction: "ASC"
    }
});
dsCashier.on('beforeload', assignBaseParams);

search = new Ext.ux.form.SearchField(
{
    paramName: 'search',
    store: dsCashier,
    width: 320
});

var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), 
{
    header: 'Codigo',
    dataIndex: 'codigo'
},
{
    header: 'Catalogo',
    dataIndex: 'nombre'
}]);

/*by default columns are sortable*/
cm.defaultSortable = true;

paging = new Ext.PagingToolbar(
{
    store: dsCashier,
    displayInfo: true,
    pageSize: 20
});

var lookupGrid = new Ext.grid.GridPanel(
{
    title: 'Catalogo Search',
    store: dsCashier,
    cm: cm,
    selModel: new Ext.grid.RowSelectionModel(
    {
        singleSelect: true
    }),
    trackMouseOver: true,
    stripeRows: true,
    width: '100%',
    loadMask: true,
    viewConfig: 
    {
        forceFit: true
    },
    tbar: ['Search:', search, 
    {
        text: 'Refresh',
        tooltip: 'Reload Data',
        icon: "../resources/images/application/refresh.png",
        cls: 'x-btn-text-icon',
        handler: loadDataSource
    }],
    bbar: paging
});


setup();

function setup()
{
    loadDataSource();
}

function assignBaseParams()
{
    dsCashier.baseParams.limit = paging.pageSize;
    dsCashier.baseParams.search = (search.getValue() != undefined ? search.getValue() : '');
    dsCashier.baseParams.isLookup = true;
   Ext.apply(dsCashier.baseParams, window.opener.lookupField.params);
}

function loadDataSource()
{
    dsCashier.load(
    {
        params: 
        {
            start: paging.cursor
        }
    });
}
