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
using System.Runtime.Serialization;
using System.Collections.Generic;

namespace ChildDataPIN.ApplicationHelper.Services
{
    public class RetrieveMultipleResponse<TEntity> : RetrieveResponse
    {
        private List<TEntity> _list;                
        

        public RetrieveMultipleResponse()
        { }

        [DataMember]
        public List<TEntity> data
        {
            get
            {
                return _list;
            }
            set
            {
                _list = value;
            }
        }
    }

}
