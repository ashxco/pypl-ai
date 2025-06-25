import QuickAccessItem from './QuickAccessItem';
import styles from '../styles/QuickAccess.module.css';

const items=[
  {icon:'hand-arrow-down', label:'Request money'},
  {icon:'hand-arrow-up',   label:'Send Money'},
  {icon:'receipt',         label:'Invoicing'},
  {icon:'qr-code',         label:'QR Code'},
  {icon:'truck',           label:'Shipping'},
  {icon:'code',            label:'Pay links'},
  {icon:'shopping-cart',   label:'Online checkout'},
  {icon:'wallet',          label:'PayPal Working Capital'},
  {icon:'credit-card',     label:'Business Debit Card'},
  {icon:'phone',           label:'Virtual Terminal'},
  {icon:'storefront',      label:'Zettle'},
  {icon:'stack',           label:'Business Tools'},
];

export default function QuickAccessSection(){
  return(
    <div className={styles.list}>
      {items.map(it=>(
        <QuickAccessItem key={it.label} icon={it.icon} label={it.label}/>
      ))}
    </div>
  );
} 