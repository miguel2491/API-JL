import sql from 'mssql'

const dbSettings = {
    user:"sa",
    password:"E95c2983a6$",
    server:"10.0.0.4",
    database:"CISA_DB",
    options:{
        encrypt:false,
        trustServerCertificate:true
    }
}

export const getConnection = async () => {
    try
    {
        const pool = await sql.connect(dbSettings);
        const result = await pool.request().query("SELECT GETDATE()")
        console.log(result)
        return pool;
    }   
    catch (error)
    {
        console.error(error);
    } 
} 
