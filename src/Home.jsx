import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    let { register, handleSubmit, formState } = useForm();
    let navigate = useNavigate();

    let onSubmit = (data) => {
        navigate("/result", { state: data });
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-lg p-4 w-100 w-md-75 w-lg-45 user-card">
                <div className="text-center mb-4">
                    <p className="display-6 fw-semibold mb-0" style={{color: "#4c0519"}}>Love Sync</p>
                    <p className="text-muted mb-0 mt-1 fs-5">Where hearts connect 💖</p>
                    <hr className='mt-1'/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <h5 className="fw-semibold mb-2">👤 Your Details</h5>

                        <p className='fst-italic fw-normal text-light mb-1 ms-4' style={{fontSize:"0.9em"}}>Name, DOB(Date of birth)</p>
                        <input {...register("p1Name", { required: { value: true, message: "Name is required" } })} placeholder="Your Name" className="form-control mb-1"/>
                        <div className="form-text text-danger fst-italic">{formState.errors?.p1Name?.message}</div>

                        <input type="date" {...register("p1Dob", { required: { value: true, message: "DOB is required" } })} className="form-control mt-2 mb-1"/>
                        <div className="form-text text-danger fst-italic">{formState.errors?.p1Dob?.message}</div>

                        <select {...register("p1Gender")} className="form-select mt-2">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <hr />
                    <div className="mb-4">
                        <h5 className="fw-semibold mb-2">💑 Partner Details</h5>

                        <p className='fst-italic fw-normal text-light mb-1 ms-4' style={{fontSize:"0.9em"}}>Name, DOB(Date of birth)</p>
                        <input {...register("p2Name", { required: { value: true, message: "Name is required" } })} placeholder="Partner Name" className="form-control mb-1"/>
                        <div className="form-text text-danger fst-italic">
                            {formState.errors?.p2Name?.message}
                        </div>
                        <input type="date" {...register("p2Dob", { required: { value: true, message: "DOB is required" } })} className="form-control mt-2 mb-1"/>
                        <div className="form-text text-danger fst-italic">{formState.errors?.p2Dob?.message}</div>

                        <select {...register("p2Gender")} className="form-select mt-2">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-danger btn-lg">💖 Check Compatibility</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
