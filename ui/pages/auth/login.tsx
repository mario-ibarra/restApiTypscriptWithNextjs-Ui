import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf } from 'zod'
import { useState } from 'react';

 const createSessionSchema = object({
        email: string().nonempty({
            message: 'Email is required'
        }),
        password: string().nonempty({
            message: 'Password is required'
        })
});

    type CreateSessionInput = TypeOf<typeof createSessionSchema>;


const LoginPage = () => {
    const router = useRouter();

    const [loginError, setLoginErrror] = useState(null);

    const { register, 
        formState: { errors }, 
        handleSubmit 
        } = useForm<CreateSessionInput>({
            resolver : zodResolver(createSessionSchema)
        });

    const onSubmit = async (values: CreateSessionInput) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`, 
            values,
            { withCredentials: true }
            );

            router.push('/');
        } catch (e) {
            setLoginErrror(e.message);
        }        
    }
    
    return (
    <div className="container">
        <h1 className='page__title'>Login</h1>
        <p>{loginError}</p>
        <form onSubmit={handleSubmit(onSubmit)}
        >  
            <div className="form-element">
                <label htmlFor="email" >Email</label>
                <input
                    type="email" 
                    id="email"  
                    placeholder="jane.doe@example.com"
                    {...register("email")}
                    />
                    <p>{errors.email?.message}</p>
            </div>

            <div className="form-element">
                <label htmlFor="password" >password</label>
                <input
                    type="password" 
                    id="password"  
                    placeholder="........"
                    {...register("password")}
                    />
                    <p>{errors.password?.message}</p>
            </div>

                <button  type="submit">Submit </button>
        </form>
        
    </div>
    )
};

export default  LoginPage;