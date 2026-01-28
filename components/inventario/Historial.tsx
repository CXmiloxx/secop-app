import { SolicitudInventario } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
interface HistorialProps {
  historial: SolicitudInventario[]
}
export default function Historial({ historial }: HistorialProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Entradas</CardTitle>
        <CardDescription>
          {historial.length} entrada(s) registrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {historial.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay entradas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{(movement.fecha)}</TableCell>
                    <TableCell className="font-medium">{movement.producto}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      +{movement.cantidad}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
