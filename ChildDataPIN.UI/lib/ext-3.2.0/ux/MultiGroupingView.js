﻿/**********************************************************************************************
* JAFFA - Java Application Framework For All - Copyright (C) 2008 JAFFA Development Group
*
* This library is free software; you can redistribute it and/or modify it under the terms
* of the GNU Lesser General Public License (version 2.1 any later).
*
* See http://jaffa.sourceforge.net/site/legal.html for more details.
*********************************************************************************************/

/** Based on Original Work found at http://extjs.com/forum/showthread.php?p=203828#post203828
*
* @author chander, PaulE
*/
Ext.namespace("Ext.ux.grid");

Ext.ux.grid.MultiGroupingView = Ext.extend(Ext.grid.GroupingView, {
  constructor: function (config) {
    Ext.ux.grid.MultiGroupingView.superclass.constructor.apply(this, arguments);
    // Added so we can clear cached rows each time the view is refreshed
    this.on("beforerefresh", function () {
      console.debug("MultiGroupingView.beforerefresh: Cleared Row Cache");
      if (this.rowsCache) delete this.rowsCache;
    }, this);

  }

  , displayEmptyFields: false

  , renderRows: function () {
    //alert('renderRows');
    var groupField = this.getGroupField();
    var eg = !!groupField;
    // if they turned off grouping and the last grouped field is hidden
    if (this.hideGroupedColumn) {
      var colIndexes = [];
      if (eg)
        for (var i = 0, len = groupField.length; i < len; ++i) {
          var cidx = this.cm.findColumnIndex(groupField[i]);
          if (cidx >= 0)
            colIndexes.push(cidx);
          else
            console.debug("Ignore unknown column : ", groupField[i]);
        }
      if (!eg && this.lastGroupField !== undefined) {
        this.mainBody.update('');
        for (var i = 0, len = this.lastGroupField.length; i < len; ++i) {
          var cidx = this.cm.findColumnIndex(this.lastGroupField[i]);
          if (cidx >= 0)
            this.cm.setHidden(cidx, false);
          else
            console.debug("Error unhiding column " + cidx);
        }
        delete this.lastGroupField;
        delete this.lgflen;
      }

      else if (eg && colIndexes.length > 0 && this.lastGroupField === undefined) {
        this.lastGroupField = groupField;
        this.lgflen = groupField.length;
        for (var i = 0, len = colIndexes.length; i < len; ++i) {
          this.cm.setHidden(colIndexes[i], true);
        }
      }

      else if (eg && this.lastGroupField !== undefined && (groupField !== this.lastGroupField || this.lgflen != this.lastGroupField.length)) {
        this.mainBody.update('');
        for (var i = 0, len = this.lastGroupField.length; i < len; ++i) {
          var cidx = this.cm.findColumnIndex(this.lastGroupField[i]);
          if (cidx >= 0)
            this.cm.setHidden(cidx, false);
          else
            console.debug("Error unhiding column " + cidx);
        }
        this.lastGroupField = groupField;
        this.lgflen = groupField.length;
        for (var i = 0, len = colIndexes.length; i < len; ++i) {
          this.cm.setHidden(colIndexes[i], true);
        }
      }
    }
    return Ext.ux.grid.MultiGroupingView.superclass.renderRows.apply(this, arguments);
  }



  /** This sets up the toolbar for the grid based on what is grouped
  * It also iterates over all the rows and figures out where each group should appeaer
  * The store at this point is already stored based on the groups.
  */
  , doRender: function (cs, rs, ds, startRow, colCount, stripe) {
    //console.debug ("MultiGroupingView.doRender: ",cs, rs, ds, startRow, colCount, stripe);
    var ss = this.grid.getTopToolbar();
    if (rs.length < 1) {
      return '';
    }

    var groupField = this.getGroupField();
    var gfLen = groupField ? groupField.length : 0;

    // Remove all entries already in the toolbar
    for (var hh = 0; hh < ss.items.length - 1; hh++) {
      var tb = ss.items.itemAt(hh);
      Ext.removeNode(Ext.getDom(tb.id));
    }
    console.debug("Toobar size is now ", ss.items.length);

    if (gfLen == 0) {
      ss.insertButton(ss.items.length - 2, new Ext.Toolbar.TextItem(this.grid.emptyToolbarText));
      console.debug("MultiGroupingView.doRender: No Groups");
    } else {
      //console.debug("MultiGroupingView.doRender: Set width to",gfLen," Groups");

      // Add back all entries to toolbar from GroupField[]    
      ss.insertButton(ss.items.length - 2, new Ext.Toolbar.TextItem("Grouped By:"));
      for (var gfi = 0; gfi < gfLen; gfi++) {
        var t = groupField[gfi];
        if (gfi > 0)
          ss.insertButton(ss.items.length - 2, new Ext.Toolbar.Separator());
        var b = new Ext.Toolbar.Button({
          text: this.cm.getColumnHeader(this.cm.findColumnIndex(t))
        });
        b.fieldName = t;
        ss.insertButton(ss.items.length - 2, b);
        //console.debug("MultiGroupingView.doRender: Added Group to Toolbar :",this,t,'=',b.text);
      }
    }

    this.enableGrouping = !!groupField;

    if (!this.enableGrouping || this.isUpdating) {
      return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
    }

    var gstyle = 'width:' + this.getTotalWidth() + ';';
    var gidPrefix = this.grid.getGridEl().id;
    var groups = [], curGroup, i, len, gid;
    var lastvalues = [];
    var added = 0;
    var currGroups = [];

    // Loop through all rows in record set
    for (var i = 0, len = rs.length; i < len; i++) {
      added = 0;
      var rowIndex = startRow + i;
      var r = rs[i];
      var differ = 0;
      var gvalue = [];
      var fieldName;
      var fieldLabel;
      var grpFieldNames = [];
      var grpFieldLabels = [];
      var v;
      var changed = 0;
      var addGroup = [];

      for (var j = 0; j < gfLen; j++) {
        fieldName = groupField[j];
        fieldLabel = this.cm.getColumnHeader(this.cm.findColumnIndex(fieldName));
        v = r.data[fieldName];
        if (v) {
          if (i == 0) {
            // First record always starts a new group
            addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v });
            lastvalues[j] = v;
          } else {
            if ((typeof (v) == "object" && (lastvalues[j].toString() != v.toString())) || (typeof (v) != "object" && (lastvalues[j] != v))) {
              // This record is not in same group as previous one
              //console.debug("Row ",i," added group. Values differ: prev=",lastvalues[j]," curr=",v);
              addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v });
              lastvalues[j] = v;
              changed = 1;
            } else {
              if (gfLen - 1 == j && changed != 1) {
                // This row is in all the same groups to the previous group
                curGroup.rs.push(r);
                //console.debug("Row ",i," added to current group");
              } else if (changed == 1) {
                // This group has changed because an earlier group changed.
                addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: v });
                //console.debug("Row ",i," added group. Higher level group change");
              } else if (j < gfLen - 1) {
                // This is a parent group, and this record is part of this parent so add it
                if (currGroups[fieldName])
                  currGroups[fieldName].rs.push(r);
                //else
                //    console.error("Missing on row ",i," current group for ",fieldName);
              }
            }
          }
        } else {
          if (this.displayEmptyFields) {
            addGroup.push({ idx: j, dataIndex: fieldName, header: fieldLabel, value: this.emptyGroupText || '(none)' });
          }
        }
      } //for j
      //if(addGroup.length>0) console.debug("Added groups for row=",i,", Groups=",addGroup);

      for (var k = 0; k < addGroup.length; k++) {
        var grp = addGroup[k];
        gid = gidPrefix + '-gp-' + grp.dataIndex + '-' + Ext.util.Format.htmlEncode(grp.value);

        // if state is defined use it, however state is in terms of expanded
        // so negate it, otherwise use the default.
        var isCollapsed = typeof this.state[gid] !== 'undefined' ? !this.state[gid] : this.startCollapsed;
        var gcls = isCollapsed ? 'x-grid-group-collapsed' : '';
        var rndr = this.cm.config[this.cm.findColumnIndex(grp.dataIndex)].renderer;
        curGroup = {
          group: rndr ? rndr(grp.value) : grp.value
           , groupName: grp.dataIndex
           , gvalue: grp.value
           , text: grp.header
           , groupId: gid
           , startRow: rowIndex
           , rs: [r]
           , cls: gcls
           , style: gstyle + 'padding-left:' + (grp.idx * 12) + 'px;'
        };
        currGroups[grp.dataIndex] = curGroup;
        groups.push(curGroup);

        r._groupId = gid; // Associate this row to a group
      } //for k
    } //for i

    // Flag the last groups as incomplete if more rows are available
    //NOTE: this works if the associated store is a MultiGroupingPagingStore!
    for (var gfi = 0; gfi < gfLen; gfi++) {
      var c = currGroups[groupField[gfi]];
      if (this.grid.store.nextKey) c.incomplete = true;
      //console.debug("Final Groups are...",c);
    }

    var buf = [];
    var toEnd = 0;
    for (var ilen = 0, len = groups.length; ilen < len; ilen++) {
      toEnd++;
      var g = groups[ilen];
      var leaf = g.groupName == groupField[gfLen - 1]
      this.doMultiGroupStart(buf, g, cs, ds, colCount);
      if (g.rs.length != 0 && leaf)
        buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(this, cs, g.rs, ds, g.startRow, colCount, stripe);

      if (leaf) {
        var jj;
        var gg = groups[ilen + 1];
        if (gg != null) {
          for (jj = 0; jj < groupField.length; jj++) {
            if (gg.groupName == groupField[jj])
              break;
          }
          toEnd = groupField.length - jj;
        }
        for (var k = 0; k < toEnd; k++) {
          this.doMultiGroupEnd(buf, g, cs, ds, colCount);
        }
        toEnd = jj;
      }
    }
    // Clear cache as rows have just been generated, so old cache must be invalid
    if (this.rowsCache) delete this.rowsCache;
    return buf.join('');
  }

  /** Initialize new templates */
  , initTemplates: function () {
    Ext.ux.grid.MultiGroupingView.superclass.initTemplates.call(this);

    if (!this.startMultiGroup) {
      this.startMultiGroup = new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', this.groupTextTpl, '</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">');
    }
    this.startMultiGroup.compile();
    this.endMultiGroup = '</div></div>';
  }

  /** Private - Selects a custom group template if one has been defined
  */
  , doMultiGroupStart: function (buf, g, cs, ds, colCount) {
    var groupName = g.groupName, tpl = null;

    if (this.groupFieldTemplates) {
      tpl = this.groupFieldTemplates[groupName];
      //console.debug("doMultiGroupStart: Template for group ",groupName, tpl);
      if (tpl && typeof (tpl) == 'string') {
        tpl = new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', tpl, '</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">');
        tpl.compile();
        this.groupFieldTemplates[groupName] = tpl;
      }
    }
    if (tpl)
      buf[buf.length] = tpl.apply(g);
    else
      buf[buf.length] = this.startMultiGroup.apply(g);
  }

  , doMultiGroupEnd: function (buf, g, cs, ds, colCount) {
    buf[buf.length] = this.endMultiGroup;
  }

  /** Should return an array of all elements that represent a row, it should bypass
  *  all grouping sections
  */
  , getRows: function () {
    var r = [];
    // This function is called may times, so use a cache if it is available
    if (this.rowsCache) {
      r = this.rowsCache;
      //console.debug('View.getRows: cached');
    } else {
      //console.debug('View.getRows: calculate');
      if (!this.enableGrouping) {
        r = Ext.grid.GroupingView.superclass.getRows.call(this);
      } else {
        var groupField = this.getGroupField();
        var g, gs = this.getGroups();
        // this.getGroups() contains an array of DIVS for the top level groups
        //console.debug("Get Rows", groupField, gs);

        r = this.getRowsFromGroup(r, gs, groupField[groupField.length - 1]);
      }
      // Clone the array, but not the objects in it
      if (r.length >= 0) {
        // Don't cache if there is nothing there, as this happens during a refresh
        //@TODO comment this to disble caching, incase of problems
        this.rowsCache = r;
      } // else   
      //console.debug("No Rows to Cache!");
    }
    //console.debug("View.getRows: Found ", r.length, " rows",r[0]);
    //console.trace();
    return r;
  }


  /** Return array of records under a given group
  * @param r Record array to append to in the returned object
  * @param gs Grouping Sections, an array of DIV element that represent a set of grouped records
  * @param lsField The name of the grouping section we want to count
  */
  , getRowsFromGroup: function (r, gs, lsField) {
    var rx = new RegExp(".*-gp-" + lsField + "-.*");

    // Loop over each section
    for (var i = 0, len = gs.length; i < len; i++) {

      // Get group name for this section
      var groupName = gs[i].id;
      if (rx.test(groupName)) {
        //console.debug(groupName, " matched ", lsField);
        g = gs[i].childNodes[1].childNodes;
        for (var j = 0, jlen = g.length; j < jlen; j++) {
          r[r.length] = g[j];
        }
        //console.debug("Found " + g.length + " rows for group " + lsField);
      } else {
        if (!gs[i].childNodes[1]) {
          console.error("Can't get rowcount for field ", lsField, " from ", gs, i);
        } else
        // if its an interim level, each group needs to be traversed as well
          r = this.getRowsFromGroup(r, gs[i].childNodes[1].childNodes, lsField);
      }
    }
    return r;
  }

  /** Override the onLoad, as it always scrolls to the top, we only
  *  want to do this for an initial load or reload. There is a new event registered in 
  *  the constructor to do this     
  */
   , onLoad: function () { }
});