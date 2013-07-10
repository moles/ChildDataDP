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
using System.ServiceModel.Activation;
using System.Text;

using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.BLL.Components.COM;
using ChildDataPIN.BLL.Entities.COM;
using ChildDataPIN.Services.Contracts.COM;
using ChildDataPIN.BLL.Components.BASE;

namespace ChildDataPIN.Services.COM
{
    [ServiceBehavior(UseSynchronizationContext = false,
    ConcurrencyMode = ConcurrencyMode.Multiple,
    InstanceContextMode = InstanceContextMode.PerCall),
    AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DeudaComunicacionesSVC : IDeudaComunicacionesSVC
    {
        public DeudaComunicacionesSVC() { }

        public RetrieveMultipleResponse<Deuda> TraerMultiples(string id, string search, int start, int limit, string sort, string dir)
        {
            RetrieveMultipleResponse<Deuda> response;
            try
            {
                RetrieveMultipleRequest<Deuda> param = new RetrieveMultipleRequest<Deuda>();
                param.PagingInfo = new PagingInfo(start, limit, sort, dir);
                param.Search = new Deuda();

                param.Search.SCName = search;

                using (DeudaComunicacionesBLL bc = new DeudaComunicacionesBLL())
                {
                    response = bc.TraerMultiples(param);
                    response.success = true;
                }

            }
            catch (Exception ex)
            {
                response = new RetrieveMultipleResponse<Deuda>();
                response.ErrorMessage = ex.Message;

            }
            return response;
        }

    }
}
