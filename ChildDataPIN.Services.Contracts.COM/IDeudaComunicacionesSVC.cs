//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/13/2010 3:15:44 PM
//--------------------------------------------------------------------------------
//
// Description: {A brief description of what this class or enumeration does or is for} //
//--------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Runtime.Serialization;

using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.BLL.Entities.COM;

namespace ChildDataPIN.Services.Contracts.COM
{
    [ServiceContract(Namespace = "ChildDataPIN.Services.Contracts.COM")]
    public interface IDeudaComunicacionesSVC
    {
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        RetrieveMultipleResponse<Deuda> TraerMultiples(string id, string search, int start, int limit, string sort, string dir);

    }

}

