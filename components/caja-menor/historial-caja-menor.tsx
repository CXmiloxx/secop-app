"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Calendar, DollarSign, MessageSquare, Send } from "lucide-react"
import type { User } from "@/lib/auth"

interface HistorialCajaMenorProps {
  user?: User
}

export function HistorialCajaMenor({ user }: HistorialCajaMenorProps) {
  const [requisiciones, setRequisiciones] = useState<any[]>([])
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [selectedRequisicion, setSelectedRequisicion] = useState<any>(null)
  const [comentario, setComentario] = useState("")

  useEffect(() => {
    loadRequisiciones()
  }, [])

  const loadRequisiciones = () => {
    const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    // Filtrar solo requisiciones de caja menor
    const cajaMenorReqs = stored.filter((r: any) => r.procesamientoCajaMenor === true)
    // Ordenar por fecha descendente
    cajaMenorReqs.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    setRequisiciones(cajaMenorReqs)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddComment = () => {
    if (!selectedRequisicion || !comentario.trim()) {
      return
    }

    const allRequisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const updatedRequisiciones = allRequisiciones.map((req: any) => {
      if (req.id === selectedRequisicion.id) {
        return {
          ...req,
          comentarios: [
            ...(req.comentarios || []),
            {
              usuario: user?.username || "Consultor",
              fecha: new Date().toISOString(),
              comentario: comentario.trim(),
            },
          ],
        }
      }
      return req
    })

    localStorage.setItem("requisiciones", JSON.stringify(updatedRequisiciones))
    setShowCommentDialog(false)
    setComentario("")
    setSelectedRequisicion(null)
    loadRequisiciones()
  }

  const isConsultor = user?.role === "Consultor"

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Requisiciones</CardTitle>
          <CardDescription>Requisiciones procesadas por caja menor</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {requisiciones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay requisiciones registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requisiciones.map((req) => (
                  <Card key={req.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{req.numeroRequisicion}</p>
                            <p className="text-sm text-muted-foreground">{req.activo}</p>
                          </div>
                          <Badge variant="default">Procesada</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Cuenta</p>
                            <p className="font-medium">{req.nombreCuenta}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Concepto</p>
                            <p className="font-medium">{req.concepto}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Cantidad</p>
                            <p className="font-medium">
                              {req.cantidad} {req.unidadMedida}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Proveedor</p>
                            <p className="font-medium">{req.proveedor}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(req.fecha)}
                          </div>
                          <div className="flex items-center gap-2 text-lg font-bold text-primary">
                            <DollarSign className="h-5 w-5" />
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(req.valorTotal)}
                          </div>
                        </div>

                        {req.justificacion && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Justificación:</p>
                            <p className="text-sm">{req.justificacion}</p>
                          </div>
                        )}

                        {req.comentarios && req.comentarios.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-2 font-semibold">Comentarios:</p>
                            <div className="space-y-2">
                              {req.comentarios.map((c: any, idx: number) => (
                                <div key={idx} className="bg-muted/50 p-2 rounded text-sm">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    <span className="font-semibold">{c.usuario}</span> - {formatDate(c.fecha)}
                                  </p>
                                  <p>{c.comentario}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {isConsultor && (
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                              onClick={() => {
                                setSelectedRequisicion(req)
                                setShowCommentDialog(true)
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Agregar Comentario
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>
              Agregue un comentario a la requisición {selectedRequisicion?.numeroRequisicion}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRequisicion && (
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p className="text-sm font-semibold">{selectedRequisicion.numeroRequisicion}</p>
                <p className="text-sm text-muted-foreground">{selectedRequisicion.activo}</p>
                <p className="text-sm">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(selectedRequisicion.valorTotal)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Comentario</label>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escriba su comentario aquí..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowCommentDialog(false)
                  setComentario("")
                  setSelectedRequisicion(null)
                }}
              >
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddComment} disabled={!comentario.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Comentario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
