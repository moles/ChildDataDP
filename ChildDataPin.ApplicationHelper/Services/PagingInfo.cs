//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 2010-11-07 10:42:41.257
//--------------------------------------------------------------------------------
// 
// Description: Breve Descripcion de la Clase 
// 
//--------------------------------------------------------------------------------
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;

namespace ChildDataPIN.ApplicationHelper.Services
{
    public class PagingInfo
    {
        private int _start;
        private int _limit;
        private SortDirection _sortDirection;
        private string _sortField;

        public PagingInfo(string sortField, string sortDirection)
            : this(0, 0, sortField, (sortDirection.Equals(SortDirection.ASC.ToString()) ? SortDirection.ASC : SortDirection.DESC))
        { }

        public PagingInfo(int start, int limit, string sortField, string sortDirection)
            : this(start, limit, sortField, (sortDirection.Equals(SortDirection.ASC.ToString()) ? SortDirection.ASC : SortDirection.DESC))            
        { }

        public PagingInfo(int start, int limit, string sortField, SortDirection sortDirection)
        {
            _start = start;
            _limit = limit;
            _sortDirection = sortDirection;
            _sortField = sortField;
        }
        
        public int Start 
        { 
            get
            {
                return _start;
            }
            set
            {   _start = value;
            
            }         
        }

        public int Limit
        { 
            get
            {
                return _limit;
            }
            set
            {   _limit = value;
            
            }         
        }

        public string SortField
        { 
            get
            {
                return _sortField;
            }
            set
            {   _sortField = value;
            
            }         
        }

        public SortDirection SortDirection
        { 
            get
            {
                return _sortDirection;
            }
            set
            {   _sortDirection = value;
            
            }         
        }

        public string GetOrderExpression()
        {
            return SortField + " " + SortDirection.ToString();
        }        
    }

}
