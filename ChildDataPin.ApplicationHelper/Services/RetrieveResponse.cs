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
using System.Collections.Generic;
using System.Runtime.Serialization;

using System.ComponentModel;
using System.Data.Common;
using System.Data.EntityClient;
using System.Data.Objects.DataClasses;
using System.Data.Objects;
using System.Data.Metadata.Edm;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace ChildDataPIN.ApplicationHelper.Services
{
    [DataContract]
    public class RetrieveResponse : Response
    {
        private int _totalCount;

        [DataMember]
        public int totalCount
        {
            get
            {
                return _totalCount;
            }
            set
            {
                _totalCount = value;
            }
        }

    }
}
