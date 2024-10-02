export interface Appointment {
  appointmentId: number;
  portName: string;
  terminalName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  plateNo: string;
  phoneNumber: string;
  trCompanyName: string;
  gstNo: string;
  transportLicNo: string;
  driverName: string;
  moveType: string;
  containerNumber: string;
  sizeType: string;
  line: string;
  chassisNo: string;
  appointmentStatus: string;
  appointmentCreated: Date;
  appointmentValidThrough: Date;
  appointmentLastModified: Date;
  gateCode: string;
}
