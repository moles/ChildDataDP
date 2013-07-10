//--------------------------------------------------------------------------------
// Child Data for Plan International Nicaragua
// Developed by: Modesto Bobadilla Larios
// Created On: 11/7/2010 1:30:02 PM
//--------------------------------------------------------------------------------
//
// Description: Clase generica para manipulacion de objetos
//--------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Data.Objects;
using System.Data.Common;
using System.Collections.ObjectModel;
using System.Data;
using System.Data.SqlClient;
using System.Transactions;
using System.Data.EntityClient;
using System.Linq.Expressions;

using ChildDataPIN.ApplicationHelper;
using ChildDataPIN.ApplicationHelper.Services;
using ChildDataPIN.ApplicationHelper.Query;
using ChildDataPIN.BLL.Entities.BASE;
using ChildDataPIN.DAL.BASE;

namespace ChildDataPIN.DAL.BASE
{
    public class DataAccess<TEntity> : IDisposable
        where TEntity : class
    {
        private ObjectContext _ctx;
        private Dictionary<string, object> _entities;
        
        private string _entityName;

        public DataAccess()
        { }

        public DataAccess(ObjectContext ctx)
        {
            this._ctx = ctx;

            _entities = new Dictionary<string, object>();

        }
        
        public string EntityName
        {
            get
            {
                return _entityName;
            }
            set
            {
                _entityName = value;
            }
        }

        /// <summary>
        /// En caso que se use un nombre diferente de la tabla para la entidad del DataModel
        /// Setear esta propiedad con el nombre real de la tabla. Si va nula ocupa el nombre
        /// de la entidad que lo esta invocando.
        /// </summary>
        public string CustomEntityName { get { return EntityName; } set { EntityName = value; } }

        protected void SaveChanges()
        {
            _ctx.SaveChanges();
        }

        private void OpenConnection()
        {
            if (_ctx.Connection.State != ConnectionState.Open)
                _ctx.Connection.Open();
        }

        protected ObjectContext basectx
        {
            get
            {
                OpenConnection();

                return this._ctx;
            }
        }

        private EntityConnection EntityConnection
        {
            get
            {
                OpenConnection();

                return (EntityConnection)_ctx.Connection;
            }
        }

        public void Dispose()
        {
        }

        /// <summary>
        /// Metodo Generico para Guardar Registros
        /// </summary>
        /// <param name="record"></param>
        public virtual void Guardar(TEntity record)
        {
            (basectx.CreateObjectSet<TEntity>()).AddObject(record);
            this._ctx.SaveChanges();
        }

        /// <summary>
        /// Retorna los datos a partir de una tabla
        /// </summary>
        /// <param name="filter">Condition to use it in where clause</param>
        /// <returns>A record from the given object set</returns>
        public virtual TEntity TraerDatosTable(Expression<Func<TEntity, bool>> filter)
        {
            return basectx.CreateObjectSet<TEntity>().Where(filter).FirstOrDefault();
        }

        /// <summary>
        /// Retorna datos a partir de una vista segun la expresion linq
        /// </summary>
        /// <typeparam name="V">Object Set</typeparam>
        /// <param name="filter">Filter condition</param>
        /// <returns>A record from the given object set</returns>
        public virtual V TraerDatosVW<V>(Expression<Func<V, bool>> filter)
            where V : class
        {
            return basectx.CreateObjectSet<V>().Where(filter).FirstOrDefault();
        }

        /// <summary>
        /// Retorna el numero total de registros segun una condicion linq
        /// </summary>
        /// <typeparam name="V">Name of the related EntitySet</typeparam>
        /// <param name="filter">Filter condition to use it in where clause</param>
        /// <returns>The count of the records in the given object set by the specific filter</returns>
        public virtual int Count<V>(Expression<Func<V, bool>> filter)
            where V : class
        {
            return basectx.CreateObjectSet<V>().Where(filter).Count();
        }

        /// <summary>
        /// Retorna multiples datos segun una clase
        /// </summary>
        /// <typeparam name="V">Nombre de la clase que se tiene que retornar</typeparam>
        /// <typeparam name="T">Nombre de la clase con la que se va a hacer la busqueda</typeparam>
        /// <param name="request"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<V> TraerMultiples<V>(RetrieveMultipleRequest<V> request)
            where V : class
        {
            if (request.SearchCondition != null)
            {
                if (request.PagingInfo != null)
                {
                    RetrieveMultipleResponse<V> response = new RetrieveMultipleResponse<V>();

                    IObjectSet<V> objectSet = basectx.CreateObjectSet<V>();

                    response.data = objectSet.Where(request.SearchCondition).OrderUsingSortExpression(request.PagingInfo.GetOrderExpression()).Skip(request.PagingInfo.Start).Take(request.PagingInfo.Limit).ToList();
                    response.totalCount = objectSet.Where(request.SearchCondition).Count();

                    return response;
                }
                else
                    return TraerMultiples<V>(request.SearchCondition);
            }
            else
                return TraerMultiples<V>(request.PagingInfo);
        }

        /// <summary>
        /// Retorna una lista de registros del tipo especificado aplicando la paginacion.
        /// </summary>
        /// <typeparam name="V"></typeparam>
        /// <param name="pagingInfo"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<V> TraerMultiples<V>(PagingInfo pagingInfo)
             where V : class
        {
            IObjectSet<V> objectSet = basectx.CreateObjectSet<V>();

            if (pagingInfo != null)
            {
                RetrieveMultipleResponse<V> response = new RetrieveMultipleResponse<V>();

                response.data = objectSet.OrderUsingSortExpression(pagingInfo.GetOrderExpression()).Skip(pagingInfo.Start).Take(pagingInfo.Limit).ToList();
                response.totalCount = objectSet.Count();

                return response;
            }
            else
                return TraerMultiples<V>();
        }

        /// <summary>
        /// Este metodo no usa un ordenamiento y tampoco la paginacion
        /// </summary>
        /// <typeparam name="V"></typeparam>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<V> TraerMultiples<V>(Expression<Func<V, bool>> filter)
             where V : class
        {
            IObjectSet<V> objectSet = basectx.CreateObjectSet<V>();

            if (filter != null)
            {
                RetrieveMultipleResponse<V> response = new RetrieveMultipleResponse<V>();

                response.data = objectSet.Where(filter).ToList();
                response.totalCount = objectSet.Where(filter).Count();

                return response;
            }
            else
                return TraerMultiples<V>();
        }

        /// <summary>
        /// Retorna multiples datos de una tabla segun una condicion
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual List<TEntity> TraerMultiplesTable(Expression<Func<TEntity, bool>> filter)
        {
            return basectx.CreateObjectSet<TEntity>().Where(filter).ToList();
        }

        /// <summary>
        /// Retorna multiples registros segun un objeto
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual List<V> TraerMultiplesFrom<V>(Expression<Func<V, bool>> filter)
            where V : class
        {
            return basectx.CreateObjectSet<V>().Where(filter).ToList();
        }

        /// <summary>
        /// Retorna una lista de registros del tipo especificado.
        /// </summary>
        /// <typeparam name="V"></typeparam>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<V> TraerMultiples<V>()
            where V : class
        {
            RetrieveMultipleResponse<V> response = new RetrieveMultipleResponse<V>();

            IObjectSet<V> objectSet = basectx.CreateObjectSet<V>();

            response.data = objectSet.ToList();
            response.totalCount = objectSet.Count();

            return response;
        }
        
        /// <summary>
        /// Retorna una lista de registros de la tabla asociada al data access segun el objeto request dado.
        /// </summary>
        /// <typeparam name="V">Nombre de la clase que se tiene que retornar</typeparam>
        /// <typeparam name="T">Nombre de la clase con la que se va a hacer la busqueda</typeparam>
        /// <param name="request"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<TEntity> TraerMultiples(RetrieveMultipleRequest<TEntity> request)
        {
            if (request.SearchCondition != null)
            {
                if (request.PagingInfo != null)
                {
                    RetrieveMultipleResponse<TEntity> response = new RetrieveMultipleResponse<TEntity>();

                    IObjectSet<TEntity> objectSet = basectx.CreateObjectSet<TEntity>();

                    response.data = objectSet.Where(request.SearchCondition).OrderUsingSortExpression(request.PagingInfo.GetOrderExpression()).Skip(request.PagingInfo.Start).Take(request.PagingInfo.Limit).ToList();
                    response.totalCount = objectSet.Where(request.SearchCondition).Count();

                    return response;
                }
                else
                    return TraerMultiples(request.SearchCondition);
            }
            else
                return TraerMultiples(request.PagingInfo);
        }

        /// <summary>
        /// Retorna una lista de registros de la tabla asociada al data access aplicando la paginacion
        /// </summary>
        /// <param name="pagingInfo"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<TEntity> TraerMultiples(PagingInfo pagingInfo)
        {
            IObjectSet<TEntity> objectSet = basectx.CreateObjectSet<TEntity>();

            if (pagingInfo != null)
            {
                RetrieveMultipleResponse<TEntity> response = new RetrieveMultipleResponse<TEntity>();

                response.data = objectSet.OrderUsingSortExpression(pagingInfo.GetOrderExpression()).Skip(pagingInfo.Start).Take(pagingInfo.Limit).ToList();
                response.totalCount = objectSet.Count();

                return response;
            }
            else
                return TraerMultiples();
        }

        /// <summary>
        /// Retorna una lista de registros de la tabla asociada al data access aplicando la condicion especificada
        /// </summary>
        /// <typeparam name="V"></typeparam>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<TEntity> TraerMultiples(Expression<Func<TEntity, bool>> filter)
        {
            IObjectSet<TEntity> objectSet = basectx.CreateObjectSet<TEntity>();

            if (filter != null)
            {
                RetrieveMultipleResponse<TEntity> response = new RetrieveMultipleResponse<TEntity>();

                response.data = objectSet.Where(filter).ToList();
                response.totalCount = objectSet.Where(filter).Count();

                return response;
            }
            else
                return TraerMultiples();
        }

        /// <summary>
        /// Retorna todos los datos de la tabla asociada al data access
        /// </summary>
        /// <returns></returns>
        public virtual RetrieveMultipleResponse<TEntity> TraerMultiples()
        {
            RetrieveMultipleResponse<TEntity> response = new RetrieveMultipleResponse<TEntity>();

            IObjectSet<TEntity> objectSet = basectx.CreateObjectSet<TEntity>();

            response.data = objectSet.ToList();
            response.totalCount = objectSet.Count();

            return response;
        }

        /// <summary>
        /// Metodo Generico para Actualizar
        /// </summary>
        /// <param name="record"></param>
        public virtual void Actualizar(TEntity record)
        {
            basectx.CreateObjectSet<TEntity>().ApplyCurrentValues(record);
            this._ctx.SaveChanges();
        }

        /// <summary>
        /// Dettach an instance
        /// </summary>
        /// <param name="record"></param>
        public virtual void Detach(TEntity record)
        {
            basectx.Detach(record);
        }

        /// <summary>
        /// Metodo generico para Borrar
        /// </summary>
        /// <param name="record"></param>
        public virtual void Borrar(TEntity record)
        {
            basectx.CreateObjectSet<TEntity>().DeleteObject(record);

            this._ctx.SaveChanges();
        }
        
    }

}

