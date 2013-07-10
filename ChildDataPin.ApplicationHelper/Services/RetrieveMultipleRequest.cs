﻿//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 2010-11-07 10:42:41.257
//--------------------------------------------------------------------------------
// 
// Description: Breve Descripcion de la Clase 
// 
//--------------------------------------------------------------------------------
using System;
using System.Runtime.Serialization;

namespace ChildDataPIN.ApplicationHelper.Services
{
    public class RetrieveMultipleRequest<V> : RetrieveRequest<V>
        where V : class
    {
        private PagingInfo _pagingInfo;

        public RetrieveMultipleRequest()
        { }

        [DataMember]
        public PagingInfo PagingInfo
        {
            get
            {
                return _pagingInfo;
            }
            set
            {
                _pagingInfo = value;
            }
        }
    }

}
