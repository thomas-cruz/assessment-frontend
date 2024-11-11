"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "chart.js/auto";
import Navbar from "@/components/Navbar";
import InputField from "@/components/InputField";
import {
  createParticipation,
  getAllParticipationByUsername,
  updateParticipationById,
  deleteParticipationById,
  getAllParticipations,
} from "@/services/participationService";
import { formatParticipationData } from "../../utils/text";
import { getRandomColor } from "../../utils/color";
import axios from "axios";
import Swal from "sweetalert2";
import ParticipationChart from "@/components/ParticipationChart";
import ParticipationTable from "@/components/ParticipationTable";

interface FormInputs {
  id?: number;
  firstName: string;
  lastName: string;
  percentage: number;
  createdAt?: string;
  [key: `percentage_${number}`]: number;
  [key: `firstName_${number}`]: string;
  [key: `lastName_${number}`]: string;
}

interface ParticipationData {
  id: number;
  firstName: string;
  lastName: string;
  percentage: number; // Adjust the type if it can be other than number
}

const Dashboard: React.FC = () => {
  const [participationData, setParticipationData] = useState<
    ParticipationData[]
  >([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await createParticipation(data);
      reset();
      fetchParticipationData();
      Swal.fire("Success", "Participation created successfully!", "success");
    } catch (error) {
      handleError(error);
    }
  };

  const fetchParticipationData = async () => {
    try {
      const { data } = await getAllParticipations();
      setParticipationData(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchParticipationData();
  }, []);

  const memoizedParticipationData = useMemo(() => {
    return participationData;
  }, [participationData]);

  const labels = formatParticipationData(memoizedParticipationData);
  const percentages = memoizedParticipationData.map(
    (participation) => participation.percentage
  );
  const backgroundColors = percentages.map(() => getRandomColor());

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = async (id: number) => {
    const updatedData = {
      firstName: getValues(`firstName_${id}`), // Fetch current values from the form
      lastName: getValues(`lastName_${id}`),
      percentage: getValues(`percentage_${id}`),
    };

    try {
      await updateParticipationById(updatedData, id);
      setEditingId(null);
      fetchParticipationData();
      Swal.fire("Success", "Participation updated successfully!", "success");
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteParticipationById(id!);
          fetchParticipationData();
          Swal.fire("Deleted!", "Participation has been deleted.", "success");
        } catch (error) {
          handleError(error);
        }
      }
    });
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      Swal.fire(
        "Error",
        error.response?.data.message || error.message,
        "error"
      );
    } else {
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  const data = {
    labels,
    datasets: [
      {
        data: percentages,
        backgroundColor: backgroundColors,
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-blue-dark-500 p-6 flex flex-col md:flex-row justify-center gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4 items-start"
        >
          <div className="flex flex-col w-full md:w-auto">
            <InputField
              register={register}
              name="firstName"
              placeholder="First name"
              options={{ required: "First name is required." }}
              error={errors.firstName}
            />
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <InputField
              register={register}
              name="lastName"
              placeholder="Last name"
              options={{ required: "Last name is required." }}
              error={errors.lastName}
            />
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <InputField
              register={register}
              name="percentage"
              placeholder="Participation"
              type="number"
              options={{
                required: "Participation is required.",
                valueAsNumber: true,
              }}
              error={errors.percentage}
            />
          </div>

          <button
            type="submit"
            className="text-white border border-white bg-blue-dark-500 hover:bg-blue-dark-700 hover:text-white font-semibold py-2 px-4 rounded"
          >
            SEND
          </button>
        </form>
      </div>
      {/* Chart and Data Section */}
      <div className="p-6">
        <h2 className="text-center text-3xl font-semibold mb-4">DATA</h2>
        <p className="text-center text-gray-500 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
          <ParticipationTable
            data={participationData}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSave={handleSave}
            handleCancel={handleCancel}
            register={register}
            errors={errors}
          />
          {/* Chart */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <ParticipationChart data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
