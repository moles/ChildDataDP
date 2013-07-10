Ext.ux.MenuPanel = function (config) {
  Ext.ux.MenuPanel.superclass.constructor.call(this,
    {
      //id: 'menu-panel',
      root: new Ext.tree.TreeNode('Menu'),
      title: config.title,
      split: true,
      width: 150,
      maxSize: 400,
      collapsible: true,
      margins: '0 0 5 5',
      cmargins: '0 5 5 5',
      rootVisible: false,
      lines: false,
      autoScroll: true,
      collapseFirst: false
    });
  this.getSelectionModel().on(
    {
      'beforeselect': function (sm, node) {
        return node.isLeaf();
      },
      'selectionchange': function (sm, node) {
        this.previousComponentNode = this.currentComponentNode;
        this.currentComponentNode = node;
        if (node != this.defaultComponentNode)
          this.mask();
        this.fireEvent('menuitemselect', node);
      },
      scope: this
    });
  this.addEvents(
    {
      menuitemselect: true
    });
  var length = config.menu.length, children, level3, nodeLevel3, node, auxNode;
  for (var i = 0; i < length; i++) {
    config.menu[i].cls = 'menu-group';
    config.menu[i].iconCls = 'menu-item-parent';
    config.menu[i].expanded = (config.menu[i].expanded == null ? true : config.menu[i].expanded);
    node = new Ext.tree.TreeNode(config.menu[i]);
    children = config.menu[i].children;
    this.loadChildren(this, children, node);   
    this.root.appendChild(node);
  } //for

  /*node.appendChild(auxNode = new Ext.tree.TreeNode(children[j]));
  if (children[j].defaultComponent == true)
  this.defaultComponentNode = auxNode;*/

  //Assign the first node of the first group if no defaultComponentNode is specified
  if (this.defaultComponentNode == null)
    this.defaultComponentNode = this.root.firstChild.firstChild;
};
Ext.extend(Ext.ux.MenuPanel, Ext.tree.TreePanel,
{
  region: 'west',
  defaultComponentNode: null,
  currentComponentNode: null,
  previousComponentNode: null,
  getDefaultComponentNode: function () {
    return this.defaultComponentNode;
  },
  getSelectedNode: function () {
    return this.currentComponentNode;
  },
  commitSelection: function () {
    this.unMask();
  },
  cancelSelection: function () {
    this.currentComponentNode = this.previousComponentNode;
    if (this.currentComponentNode != null) {
      this.currentComponentNode.select();
    }
    this.previousComponentNode = null;
    this.unMask();
  },
  mask: function () {
    this.getEl().mask();
  },
  unMask: function () {
    this.getEl().unmask();
  },
  //force will always dispatch an event to do the component load
  selectDefaultComponentNode: function () {
    this.defaultComponentNode.select();
  },
  loadChildren: function (scope, children, node) {
    //OCFS: aun no esta completo
    var level3, nodeLevel3, auxNode;

    for (var j = 0; j < children.length; j++) {
      children[j].leaf = children[j].leaf == null ? true : children[j].leaf;  //true;
      if (children[j].leaf == true) {
        children[j].cls = "menu-item"
        children[j].iconCls = (children[j].iconCls == null ? children[j].component + '16x16' : children[j].iconCls);
        node.appendChild(auxNode = new Ext.tree.TreeNode(children[j]));
        if (children[j].defaultComponent == true)
          scope.defaultComponentNode = auxNode;
      }
      else {
        //meter esto en recursive function
        children[j].cls = "menu-group";
        children[j].iconCls = "menu-item-parent";
        node.appendChild(new Ext.tree.TreeNode(children[j])); //
        nodeLevel3 = node.childNodes[j];
        level3 = children[j].children;
        for (var k = 0; k < level3.length; k++) {
          level3[k].cls = "menu-item";
          level3[k].iconCls = (level3[k].iconCls == null ? level3[k].component + '16x16' : level3[k].iconCls);
          level3[k].leaf = true;
          nodeLevel3.appendChild(auxNode = new Ext.tree.TreeNode(level3[k]))
          if (level3[k].defaultComponent == true)
            scope.defaultComponentNode = auxNode;
        }
        this.loadChildren(scope, nodeLevel3, level3);
      } //else
      
    } //for

  },
  reloadCurrentComponent: function () {
    if (this.currentComponentNode == null) {
      this.selectDefaultComponentNode();
    }
    else {
      if (this.currentComponentNode == this.defaultComponentNode)
        this.fireEvent('menuitemselect', this.defaultComponentNode);
      else
        this.fireEvent('menuitemselect', this.currentComponentNode);
    }
  }
});
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
        var workplace = this;
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
                            alert(eval(xhr.responseText));
                            workplace.setComponent(newComponent, node);
                        }
                        catch (ex) {
                            alert(Ext.util.JSON.encode(ex));
                            workplace.fireEvent('componentloadfailure', this, node.getOwnerTree());
                        }
                        workplace.unMask();
                    },
                    failure: function (ex) {
                        alert(Ext.util.JSON.encode(ex));
                        workplace.fireEvent('componentloadfailure', this, node.getOwnerTree());
                        workplace.unMask();
                    }
                });
            }
            else {
                alert('failuire');
                this.fireEvent('componentloadfailure', this, node.getOwnerTree());
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
            this.fireEvent('componentloadsuccess', this, node.getOwnerTree());

            if (this.formPanel != component)
                component.on('datachanged', function () {
                    scope.fireEvent('subcomponentdatachanged', component);
                });
        }
        catch (ex) {
            alert(ex);
            this.fireEvent('componentloadfailure', this, node.getOwnerTree());
        }
    },
    mask: function () {
        this.getEl().mask('Loading...');
    },
    unMask: function () {
        this.getEl().unmask();
    }
});
Ext.ux.Workplace = function (config) {
    Ext.apply(this, config);
    Ext.ux.Workplace.superclass.constructor.call(this,
    {
        id: 'component-viewer'
    });
};
Ext.extend(Ext.ux.Workplace, Ext.Viewport,
{
    titleTemplate: '',
    topPanel: null,
    componentHolder: null,
    menuPanel: null,
    params: {},
    initComponent: function () {
        Ext.lib.Ajax.defaultPostHeader = 'application/json';

        this.initTopPanel();

        this.tpl = new Ext.Template("");

        /*this.initMenuPanel(
        {
        menu: this.menu
        });*/

        this.modulesPanel = new Array();

        if (this.modules != null) {
            var module = null, menuPanel = null;

            for (var a = 0, len1 = this.modules.length; a < len1; a++) {
                module = this.modules[a];

                if (module != undefined) {

                    menuPanel = this.createMenuPanel(module);

                    this.modulesPanel[a] = menuPanel;                }
            }
        }

        this.initComponentHolder(
        {
            formPanel: this.formPanel
        });

        Ext.apply(this,
        {
            layout: 'border',
            items: [
            this.topPanel,
            {
                region: 'west',
                margins: '5 0 5 5',
                split: true,
                width: 210,         
                layout: 'accordion',
                items: this.modulesPanel
            }, this.componentHolder]
        });

        this.on('afterrender', function () {
            this.updateTitle();

            this.modulesPanel[0].selectDefaultComponentNode();
            //this.updateMenu();

            //This two lines are require because if the panel is visible initially the screen flick            
            this.doLayout();

            Ext.QuickTips.init();
            Ext.form.Field.prototype.msgTarget = 'side';
        });

        Ext.ux.Workplace.superclass.initComponent.apply(this, arguments);
    },
    initTopPanel: function () {
        var titleTemplateMarkup = ['<table width="100%" height="100%"><tr><td class="title-box-main workplace48x48" width="200px"></td><td align="right" style="padding-bottom:2px;font:11px arial,tahoma,helvetica,sans-serif;"><div class="workplace-system-user">System Administrator</div><div class="workplace-user-branch">Nicaragua</div><div class="workplace-logout">Logout</div></td></tr></table>'];

        this.titleTemplate = new Ext.Template(titleTemplateMarkup);

        this.topPanel = new Ext.Panel(
        {
            layout: 'border',
            height: 85,
            region: 'north',
            bbar: new Ext.Toolbar(
            {
                style: 'position:inherit',
                items: [
                (this.tbar == null ? '' : [this.tbar, '-']),
                '->',
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
    createMenuPanel: function (config) {
        if (config.groups == null)
            return;

        workplace = this;

        var menuPanel = new Ext.ux.MenuPanel(
        {
            title: config.text,
            html: 'Menu Panel',
            menu: config.groups
        });

        menuPanel.on('expand', function () {
            menuPanel.reloadCurrentComponent();
        });

        menuPanel.on('menuitemselect', function (node) {
            workplace.componentHolder.loadComponent(node);
        });

        return menuPanel;
    },
    initComponentHolder: function (config) {
        var workplace = this;
        this.componentHolder = new Ext.ux.ComponentHolder(
        {
            formPanel: config.formPanel,
            html: 'Component Holder'
        });

        this.componentHolder.on('subcomponentdatachanged', function () {
            workplace.search(true);
        });


        this.componentHolder.on('componentloadsuccess', function (componentHolder, menuPanel) {
            menuPanel.commitSelection();
        });

        this.componentHolder.on('componentloadfailure', function (componentHolder, menuPanel) {
            alert('Could not load the component.');
            menuPanel.cancelSelection();
        });

    },
    updateTitle: function () {
        var titleBox = Ext.getCmp('title-box');
        this.titleTemplate.overwrite(titleBox.body,
        {
        //User: this.SystemUser        
    });
},
setDescription: function (description) {
    this.recordDescription = description;
    this.updateTitle();
},
/**
* Just the baseParams if none aditional parameter is passed.
*/
load: function () {
    this.fireEvent('beforeload', this);
},
onLoadSuccess: function () {
    //alert('Load success.');
},
onLoadFailed: function () {
    alert('Load failed.');
},
/**
* Function to be executed by every child node.
* @param {Function} fn
*/
updateLink: function (fn) {
    this.linkPanel.root.eachChild(function (node) {
        node.eachChild(fn);
    }, this);
},
/**
* Only if the menuPanel is visible.
*/
updateMenu: function () {
    if (this.menuPanel) {
        var workplace = this;

        this.menuPanel.root.eachChild(function (node) {

            //node.eachChild(workplace.validateMenuLink, workplace);
            node.eachChild(function (node) {
                workplace.validateMenuLink(node, workplace);
            })
        });
    }
},
/**
*
* @param {Object} node
* @param {Object} scope
*/
validateMenuLink: function (node, scope) {

    //Solo el nodo del default component puede estar habilitado siempre.
    if (!node.attributes.defaultComponent) {
        //Si el nodo no tiene acceso o el registro actual es null entonces se deshabilita
        if (node.attributes.allowedAccess && scope.currentRecord != null) //Indicates that this node must be validated with
        {
            //Se supone que todos los nodos que estan aca tienen relacion con el registro cargado
            //por lo tanto deben tener un url template.
            if (node.attributes.urlTemplate && scope.currentRecord.data) {
                scope.tpl.set(node.attributes.urlTemplate);

                if (node.attributes.validate == null) //Si no tiene una funcion para validarlo entonces se habilita
                    node.enable();
                else
                    node.attributes.validate(node, scope.currentRecord.data); //Se ejecuta la funcion que tenga definida para validarlo
                node.attributes.url = scope.tpl.apply(scope.currentRecord.data, true);
            }
            else
                node.disable();
        }
        else
            node.disable();
    }

    return true;
},
/**
A los menu que se les quiera actualizar el status dinamicamente se les debe poner un id y se debe
llamar a este metodo para hacerlo, el cual a su vez utiliza el metodo validateMenuLink en caso
que el nodo se esta habilitando de lo contrario se deshabilita de inmediato.
**/
setMenuDisabled: function (nodeId, disabled) {
    var node = null;
    /**
    * Menu category
    * @param {Ext.tree.Node} group
    */
    this.menuPanel.root.eachChild(function (group) {

        node = group.findChild("id", nodeId);

        return node == null;
    });

    if (node != null) {
        if (disabled)
            node.disable();
        else
            this.validateMenuLink(node, this);
    }
}
});