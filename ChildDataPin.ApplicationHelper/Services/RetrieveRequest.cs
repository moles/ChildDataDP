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
using System.Linq.Expressions;

namespace ChildDataPIN.ApplicationHelper.Services
{
    public class RetrieveRequest<V> : Request
        where V : class
    {
        private V _search;
        private Expression<Func<V, bool>> _searchCondition;

        public V Search
        {
            get
            {
                return _search;
            }
            set
            {
                _search = value;
            }
        }

        public Expression<Func<V, bool>> SearchCondition
        {
            get
            {
                return _searchCondition;
            }
            set
            {
                this._searchCondition = value;
            }
        }
    }

}
