import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { accountStyles as styles } from '@/styles/accountStyles';
import { emptyPaymentDetails, paymentDetailsError, type PaymentDetails } from '@/services/paymentDetails';

export function PaymentDetailsFields({ value, onChange, disabled = false }: {
  value: PaymentDetails; onChange: (value: PaymentDetails) => void; disabled?: boolean;
}) {
  return <View style={styles.card}>
    <Text style={styles.title}>Payment details</Text>
    <Text style={styles.body}>Where members should send their contributions outside ThriftCircle.</Text>
    {([['bankName', 'Bank name'], ['accountName', 'Account name'], ['accountNumber', 'Account number'], ['referenceNote', 'Payment reference (optional)']] as const).map(([key,label]) =>
      <View key={key}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value[key]} editable={!disabled}
        onChangeText={text=>onChange({...value,[key]:text})} style={styles.input}
        keyboardType={key==='accountNumber'?'number-pad':'default'} autoCorrect={false}/></View>)}
  </View>;
}
export function PaymentDetailsCard({ details }: { details?: Partial<PaymentDetails> | null }) {
  const available = details?.bankName && details?.accountName && details?.accountNumber;
  return <View style={styles.card}><Text style={styles.title}>Payment instructions</Text>
    {available ? <>{[['Bank',details.bankName],['Account name',details.accountName],['Account number',details.accountNumber],['Reference',details.referenceNote]].filter(([,value])=>value).map(([label,value])=>
      <View key={label}><Text style={styles.label}>{label}</Text><Text selectable style={styles.body}>{value}</Text></View>)}</>
      : <Text style={styles.body}>Payment details have not been added. Ask your organizer for the correct details before paying.</Text>}
    <Text style={styles.body}>Payment happens outside ThriftCircle. Upload your evidence after paying.</Text>
  </View>;
}
export function PaymentDetailsEditor({ initial, disabled, onSave }: {
  initial?: Partial<PaymentDetails> | null; disabled: boolean; onSave:(value:PaymentDetails)=>void;
}) {
  const [value,setValue]=useState<PaymentDetails>({...emptyPaymentDetails,...initial});
  const [error,setError]=useState('');
  return <View><PaymentDetailsFields value={value} disabled={disabled} onChange={next=>{setValue(next);setError('');}}/>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Pressable accessibilityRole="button" disabled={disabled} style={[styles.button,disabled&&styles.disabled]}
      onPress={()=>{const problem=paymentDetailsError(value);setError(problem);if(!problem)onSave(value);}}>
      <Text style={styles.buttonText}>{disabled?'Please wait…':'Save payment details'}</Text>
    </Pressable></View>;
}
