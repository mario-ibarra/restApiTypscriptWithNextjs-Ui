import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf } from 'zod'
import { useState } from 'react';

 const createUserSchema = object({
        name: string({
        required_error: "Name is required",
        }).nonempty({
            message: "Name is required"
        }),

        email: string({
        required_error: "Email is required",
        }).email("Not a valid email").nonempty({
            message: "Email is required"
        }),

        password: string({
        required_error: "Password is required",
        }).min(6, "Password too short - should be 6 chars minimum").nonempty({
            message: "Password is required"
        }),

        passwordConfirmation: string({
        required_error: "passwordConfirmation is required",
        }).nonempty({
            message: "Password confirmation is required"
        }),

    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

    type CreateUserInput = TypeOf<typeof createUserSchema>;


const RegisterPage = () => {
    const router = useRouter();

    const [registerError, setRegisterErrror] = useState(null);

    const { register, 
        formState: { errors }, 
        handleSubmit 
        } = useForm<CreateUserInput>({
            resolver : zodResolver(createUserSchema)
        });

    const onSubmit = async (values: CreateUserInput) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`, values);

            router.push('/auth/login');
        } catch (e) {
            setRegisterErrror(e.message);
        }        
    }
    
    return (
    <div className="container">
        <h1 className='page__title'>Register</h1>
        <p>{registerError}</p>
        <form onSubmit={handleSubmit(onSubmit)}
        >
            <div className="form-element">
                <label htmlFor="name" >Name</label>
                <input
                    type="text" 
                    id="name"  
                    placeholder="Peter Pan"
                    {...register("name")}
                    />
                    <p>{errors.name?.message}</p>
            </div>

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

            <div className="form-element">
                <label htmlFor="passwordConfirmation" >passwordConfirmation</label>
                <input
                    type="password" 
                    id="passwordConfirmation"  
                    placeholder=".......... "
                    {...register("passwordConfirmation")}
                    />
                     <p>{errors.passwordConfirmation?.message}</p>
            </div>

                <button  type="submit">Submit </button>
        </form>
        
    </div>
    )
};

export default  RegisterPage