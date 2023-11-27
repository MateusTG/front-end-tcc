import type {NextPage} from 'next'
import Head from 'next/head'
import UserRegister from '@/components/user-register'

const userRegister: NextPage = () =>{
    return(
        <div>
            <Head>
                <title>Cadastro de Usuário</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href='./public/favicon.ico' />
            </Head>
            <main className="vh-100 d-flex justify-content-center align-items-center">
                <UserRegister/>
            </main>
        </div>
    )
}

export default userRegister