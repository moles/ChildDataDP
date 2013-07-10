using System;
using System.Data;
using ChildDataPIN.ApplicationHelper;
using ChildDataPIN.DAL.BASE;

namespace ChildDataPIN.DAL.COM
{
    public class ComModuleDataAccess<TEntity> : DataAccess<TEntity>
             where TEntity : class, new()
    {

         public ComModuleDataAccess()
            : base(new ComEntities())
        {

        }

        public new ComEntities ctx
        {
            get
            {
                return (ComEntities)base.basectx;
            }
        }

    }
}
