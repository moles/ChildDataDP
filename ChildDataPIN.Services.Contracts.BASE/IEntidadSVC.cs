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
using ChildDataPIN.BLL.Entities.BASE;

namespace ChildDataPIN.Services.Contracts.BASE
{
    [ServiceContract(Namespace = "ChildDataPIN.Services.Contracts.BASE")]
    public interface IEntidadSVC
    {
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        RetrieveSingleResponse<EntidadVista> TraerDatos(Guid? id);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json)]
        ServiceCommandResponse<EntidadVista>CambioDeEstado(Guid id, int statusId);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        RetrieveMultipleResponse<EntidadVista>TraerMultiples(string id, string search, int start, int limit, string sort, string dir);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json)]
        ServiceCommandResponse<Entidad>Guardar(Entidad entidad);

        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json, BodyStyle = WebMessageBodyStyle.WrappedRequest)]
        ServiceCommandResponse<EntidadVista>Actualizar(Entidad entidad);

    }

}

