Ext.onReady(function () {
    var workplace = null;

    var defaultComponent = new Ext.FormPanel(
    {
        //frame:true,
        title: 'Inicio',

        html: '<div style="text-align:center;vertical-align:middle;"><img src="../images/control-panel.jpg" /></div>'        
    });
 

    workplace = new Ext.ux.Workplace(
    {
        formPanel: defaultComponent,
        //Collapsible:true,
        //titleCollapse: true,
        title: 'Map',
      
        tbar: [
        {
            text: 'menu1'
        }, '-',
        {
            text: 'menu2'
        }, '-',
        {
            text: 'menu3'
        }],
        modules: [
        {
            text: 'menu',
            groups: [
            {
                text: 'Catalogos',
                collapsible:true,
                titleCollapse: true,
                children: [
                {
                    text: 'Testing',
                    component: 'prueba',
                    url: '../prueba/plugin.aspx'
                },
                {
                    text: 'Deuda',
                    component: 'deuda',
                    url: '../deuda/plugin.aspx'
                },
                {
                    text: 'Catalogo',
                    component: 'catalogo',
                    url: '../catalogo/plugin.aspx'
                },
                
                {
                    text: 'Catalogo Detalle',
                    component: 'catalogodetalle',
                    url: '../catalogodetalle/plugin.aspx'
                },
                {
                    text: 'Coordinador',
                    component: 'coordinador',
                    url: '../coordinador/plugin.aspx'
                },
                
                 {
                    text: 'Usuario',
                    component: 'usuarioo',
                    url: '../Usuario/plugin.aspx'
                }]
                    
            },
            {
                text: 'Otros',
                children: [
                {
                    text: 'otros',
                    component: 'componente',
                    url: '../componente/plugin.aspx'
                }]
            },
            {
                text: 'Menu',
                children: [
                {
                    text: 'test',
                    component: 'test',
                    url: '../test/plugin.aspx',
                    allowedAccess: true
                }
                ]
            }]
        }
        ]
    });
});
