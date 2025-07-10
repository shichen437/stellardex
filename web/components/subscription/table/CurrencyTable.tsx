import { Edit, Trash2, BadgeCheck } from "lucide-react";
import { type SubCurrency } from "@/lib/types/subscription";
import { usePolyglot } from "@/providers/PolyglotProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  currencies: SubCurrency[];
  onEdit: (currency: SubCurrency) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export function CurrencyTable({
  currencies,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  const { t } = usePolyglot();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[18%] text-center">
            {t("subscription.currency.field.code")}
          </TableHead>
          <TableHead className="w-[18%] text-center">
            {t("subscription.currency.field.symbol")}
          </TableHead>
          <TableHead className="w-[18%] text-center">
            {t("subscription.currency.field.rate")}
          </TableHead>
          <TableHead className="w-[18%] text-center">
            {t("subscription.currency.field.isDefault")}
          </TableHead>
          <TableHead className="w-[18%] text-center">
            {t("common.options")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currencies.map((currency) => (
          <TableRow key={currency.id}>
            <TableCell className="text-center">{currency.code}</TableCell>
            <TableCell className="text-center">{currency.symbol}</TableCell>
            <TableCell className="text-center">{currency.rate}</TableCell>
            <TableCell className="text-center">
              {currency.isDefault ? t("common.yes") : t("common.no")}
            </TableCell>
            <TableCell className="text-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(currency)}
                title={t("common.edit")}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(currency.id)}
                title={t("common.delete")}
                disabled={currency.isDefault}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {!currency.isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetDefault(currency.id)}
                  title={t("subscription.currency.setDefault")}
                >
                  <BadgeCheck className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
