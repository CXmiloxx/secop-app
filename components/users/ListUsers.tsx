
'use client'
import { UserType } from "@/types/user.types"
import { Button } from "../ui/button"
import { useState } from "react"
import Modal from "../Modal"
import User from "../auth/CreateUser"
import { UserPlus, Edit2, Trash2, Mail, Phone, Briefcase } from "lucide-react"

interface UsersProps {
  users: UserType[]
  loading: boolean
}

export default function ListUsers({ loading, users }: UsersProps) {
  const [openModal, setOpenModal] = useState(false)

  const handleCloseModal = () => setOpenModal(false)
  

  return (
    <div className="w-full min-h-screen bg-linear-to-br py-10 px-2 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-row items-center gap-3">
            <div className="rounded-xl border p-3 shadow-md">
              <UserPlus className="w-8 h-8 dark:text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold bg-linear-to-r from-blue-700 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">
                Lista de Usuarios
              </h3>
              <div className="text-gray-500 dark:text-gray-300 font-semibold text-sm">
                Gestión Presupuestal · Colegio Bilingüe Lacordaire
              </div>
            </div>
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-700 hover:to-purple-800 hover:scale-[1.02] text-base font-bold rounded-xl shadow-xl px-5 py-3 transition"
          >
            <UserPlus className="w-5 h-5" />
            Crear Usuario
          </Button>
        </div>

        <div className="rounded-3xl overflow-x-auto bg-white/90 dark:bg-gray-900/85 shadow-2xl ring-2 ring-blue-100 dark:ring-indigo-900/40 backdrop-blur-xl transition-all duration-300">
          <table className="min-w-full divide-y divide-blue-100 dark:divide-blue-900 text-[15px] md:text-base">
            <thead>
              <tr className="bg-linear-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-950/30">
                <th className="px-6 py-4 text-left font-extrabold text-blue-700 dark:text-blue-200">Nombre</th>
                <th className="px-6 py-4 text-left font-extrabold text-blue-700 dark:text-blue-200">Apellido</th>
                <th className="px-6 py-4 text-left font-extrabold text-blue-700 dark:text-blue-200">Área</th>
                <th className="px-6 py-4 text-left font-extrabold text-blue-700 dark:text-blue-200">Correo</th>
                <th className="px-6 py-4 text-left font-extrabold text-blue-700 dark:text-blue-200">Teléfono</th>
                <th className="px-6 py-4 text-center font-extrabold text-blue-700 dark:text-blue-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-blue-500 dark:text-blue-300 font-semibold">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 font-semibold">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-blue-50/40 dark:bg-gray-900/50' : 'bg-white/60 dark:bg-gray-950/30'} hover:bg-blue-100/70 dark:hover:bg-blue-900/30`}
                  >
                    <td className="px-6 py-4 flex items-center gap-2 font-bold text-gray-900 dark:text-gray-50 whitespace-nowrap">
                      <span className="inline-block p-1.5 bg-blue-100 dark:bg-blue-950 rounded-full mr-2">
                        <span className="font-bold text-blue-600 dark:text-indigo-400 uppercase">
                          {user.nombre ? user.nombre[0] : "?"}
                        </span>
                      </span>
                      {user.nombre}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-50 whitespace-nowrap">{user.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-medium">
                        <Briefcase className="w-4 h-4" />
                        {user.area?.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Mail className="w-4 h-4" />
                        {user.correo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-gray-700 dark:text-blue-100">
                        <Phone className="w-4 h-4" />
                        {user.telefono}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 px-3 py-2 text-indigo-700 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-blue-900/30 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal &&
        <Modal
          isOpen={openModal}
          onClose={handleCloseModal}
          children={<User type="edit" />}
        />}
    </div>
  )
}

