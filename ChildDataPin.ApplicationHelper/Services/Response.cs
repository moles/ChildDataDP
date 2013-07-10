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

namespace ChildDataPIN.ApplicationHelper.Services
{
    [DataContract]
    public class Response
    {
        private bool _success;
        private string _errorMessage;
        private Exception _exception;

        public Response()
        {
            _success = false;
        }

        [DataMember]
        public bool success
        {
            get
            {
                return _success;
            }
            set 
            {
                _success = value;
            }
        }

        [DataMember]
        public string ErrorMessage
        {
            get
            {
                return _errorMessage;
            }
            set
            {
                _errorMessage = value;
            }
        }

        public Exception Exception
        {
            get
            {
                return _exception;
            }
            set
            {
                _exception = value;
                if (_exception != null)
                {
                    ErrorMessage = _exception.Message;

                    if (_exception.InnerException != null)
                        _errorMessage += _exception.InnerException.Message;
                }
            }
        }
    }

}
