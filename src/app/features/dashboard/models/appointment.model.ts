export interface Appointment {
  AppointmentId: number;
  PortName: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  PlateNo: string;
  PhoneNumber: string;
  TrCompanyName: string;
  GstNo: string;
  TransportLicNo: string;
  DriverName: string;
  MoveType: string;
  ContainerNumber: string;
  SizeType: string;
  Line: string;
  ChassisNo: string;
  AppointmentStatus: string;
  AppointmentCreated: Date;
  AppointmentValidThrough: Date;
  AppointmentLastModified: Date;
  GateCode: string;
}
