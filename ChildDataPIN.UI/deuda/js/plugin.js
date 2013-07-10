(function () {
    var entityService = '../deuda/svc/DeudaComunicacionesSVC.svc';
    var url = entityService + '/TraerMultiples';
    
    var idProperty = 'Id';

    var fields = [
    { name: 'Id' },
    { name: 'SCNumber' },
    { name: 'SCName' },
    { name: 'NODescription' },
    { name: 'SPNumber' },
    { name: 'CommunicationType' },
    { name: 'ResponseDue' },
    { name: 'Location' },
    { name: 'CommunityWorkerName' },
    { name: 'ResponseStatus' }
    ];

    var dsDeudaService = new Ext.data.JsonStore(
    {
        url: url,
        root: 'data',
        totalProperty: 'totalCount',
        id: idProperty,
        fields: fields,
        remoteSort: true,
        sortInfo:
        {
            field: "SCName",
            direction: "ASC"
        }
    });

    dsDeudaService.on("beforeload", assignBaseParams);

    /**
    * paramName: Es el parametro que se define en el webservice para realizar la busqueda.
    */
    var search = new Ext.ux.form.SearchField(
    {
        paramName: 'search',
        store: dsDeudaService,
        width: 320
    });

    var paging = new Ext.PagingToolbar(
    {
        store: dsDeudaService,
        displayInfo: true,
        pageSize: 20
    });

    loadDataSource();

    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
    {
        header: 'Numero SC',
        dataIndex: 'SCNumber',
        sortable: true
    },
    {
        header: 'Nombre SC',
        dataIndex: 'SCName',
        sortable: true
    },
    {
        header: 'NO Descripcion',
        dataIndex: 'NODescription',
        sortable: true
    },
    {
        header: 'Numero SP',
        dataIndex: 'SPNumber',
        sortable: true
    },
    {
        header: 'Tipo de Comunicacion',
        dataIndex: 'CommunicationType',
        sortable: true
    },
    {
        header: 'Fecha Deuda Contestada',
        dataIndex: 'ResponseDue',
        sortable: true
    },
    {
        header: 'Localizacion',
        dataIndex: 'Location',
        sortable: true
    },
    {
        header: 'Coordinador',
        dataIndex: 'CommunityWorkerName',
        sortable: true
    },
    {
        header: 'Estado',
        dataIndex: 'ResponseStatus',
        sortable: true
    }
    ]);

    cm.defaultSortable = true;
        
    var sm = new Ext.grid.RowSelectionModel(
    {
        singleSelect: true
    });

    sm.on("selectionchange", function () {
        var record = sm.getSelected();
    });
    
    var gridPanel = new Ext.grid.GridPanel(
    {
        title: 'Deuda',
        store: dsDeudaService,
        cm: cm,
        selModel: sm,
        trackMouseOver: true,
        stripeRows: true,
        width: '100%',
        loadMask: true,
        viewConfig:
        {
            forceFit: true
        },
        tbar: [
        {
            text: 'Importar Deuda',
            tooltip: 'Import archivo de excel de deudas del mes',
            icon: "../images/xlsx.png",
            cls: 'x-btn-text-icon',            
            handler: function () {
                window.showModalDialog("../deuda/carga.aspx?id=0", "center:yes;resizable:no;dialogWidth:200px;dialogHeight:100px;");
            }
        },'-',
        {
            text: 'Actualizar',
            tooltip: 'Recarga los datos',
            icon: "../images/Actualizar16.png",
            cls: 'x-btn-text-icon',
            handler: loadDataSource
        }, '-', 'Buscar: ', search],
        bbar: paging
    });
    
    function assignBaseParams() {
        dsDeudaService.baseParams.limit = paging.pageSize;
        dsDeudaService.baseParams.search = (search.getValue() != undefined ? search.getValue() : '');
    }

    function loadDataSource() {
        dsDeudaService.load(
        {
            params:
            {
                start: paging.cursor
            }
        });
    }

    return gridPanel;

})();