import * as React from 'react';
import {Modal, Button, Row, Col, Card, Icon, notification, Form, Switch} from 'antd';
import _ from 'lodash';
import $ from 'jquery';
import md5 from 'md5';
import IAccount from '../../interfaces/IAccount';
import InputRow from './components/InputRow/index';
import CSV from '../../CSV';
import AccountApi from '../../../../api/account/account';
import IPacket from '../../Packet';
import PacketState from '../../PacketState';
import {IcoN} from '../../../../components/icon/index';

interface ICreateProps {
    visible: Boolean;
    handleClose: any;
}

interface ICreateState {
    accounts: IPacket[];
    sendSms: boolean;
}

class Create extends React.Component<ICreateProps, ICreateState> {
    accountApi;
    renderedRows = [];
    rowsRefs = {};

    constructor(props: ICreateProps) {
        super(props);
        this.state = {accounts: [], sendSms: true};
        this.accountApi = new AccountApi();
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.add = this.add.bind(this);
        // this.create = this.create.bind(this);
        this.import = this.import.bind(this);
        this.readFile = this.readFile.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.createAccount = this.createAccount.bind(this);
        // this.cleanup = this.cleanup.bind(this);
        // this.initModal = this.initModal.bind(this);
        // this.addItemWithDelay = this.addItemWithDelay.bind(this);
    }

    componentDidMount() {
        this.initModal();
    }

    initModal() {
        this.renderedRows = [];
        this.rowsRefs = {};
        this.setState({
            accounts: [],
        });
    }

    validatePockets() {
        let errorInRows: number = 0;
        this.state.accounts.forEach((row) => {

            if (row.status === PacketState.Success ||
                row.status === PacketState.Pending
            ) {
                return;
            }

            let inputRowForm = this.rowsRefs[row.key].getForm();
            const hasError = _.some(inputRowForm.getFieldsError(), (error) => _.isArray(error) && _.size(error) > 0);
            if (hasError) {
                errorInRows++;
                row.status = PacketState.Failure;
            } else {
                row.status = PacketState.Valid;
            }

            this.handleChange({
                key: row.key,
                model: row.model,
                status: row.status
            });
        });

        this.renderRows();
    }

    handleChange(params: any) {
        const packetIndex = _.findIndex(this.state.accounts, (pocket) => {
            return (pocket.key === params.key + '');
        });
        const {model, manualPassword, status} = _.clone(params);
        if (!model) {
            return;
        }
        let accounts = this.state.accounts;
        model.pass = manualPassword === false ? model._id : model.pass;
        accounts[packetIndex].status = status;
        accounts[packetIndex].model = model;
        this.setState({
            accounts: accounts,
        });
        setTimeout(() => {
            this.renderRows();
        }, 200);

    }

    handleRemove(key: string) {

        let accounts = this.state.accounts;

        _.remove(accounts, (pocket: IPacket) => {
            return pocket.key === key + '';
        });

        this.setState({
            accounts: accounts,
        });
        this.renderRows();
    }

    handleUpload(e: Event) {
        e.preventDefault();
        $('#upload').trigger('click');
    }

    readFile(e: Event) {
        const reader = new FileReader();
        reader.onload = (readEvent) => this.import(readEvent.target.result);
        reader.readAsText(e.target.files[0]);
    }

    saveRowsReference(row: any) {
        if (row) {
            this.rowsRefs[row.props.refKey] = row;
        }
    }

    renderRows() {
        // this.state.accounts.map((pocket, i) => {
        //     if (
        //         this.rowsRefs[pocket.key] &&
        //         pocket.status === this.rowsRefs[pocket.key].props.status &&
        //         _.isEqual(this.rowsRefs[pocket.key].props, pocket.model)
        //     ) {
        //         return;
        //     } else if (this.rowsRefs[pocket.key]) {
        //         this.renderedRows[i] = <InputRow
        //             key={pocket.key}
        //             onChange={this.handleChange}
        //             onRemove={this.handleRemove}
        //             ref={this.saveRowsReference.bind(this)}
        //             account={pocket.model}
        //             status={pocket.status}
        //             refKey={pocket.key}/>;
        //     } else {
        //         this.renderedRows.push(
        //             <InputRow
        //                 key={pocket.key}
        //                 onChange={this.handleChange}
        //                 onRemove={this.handleRemove}
        //                 ref={this.saveRowsReference.bind(this)}
        //                 account={pocket.model}
        //                 status={pocket.status}
        //                 refKey={pocket.key}/>
        //         );
        //     }
        // });
        // this.forceUpdate();
    }

    validRowsCount() {
        let validRows: number = 0;
        this.state.accounts.forEach((row) => {
            if (row.status === PacketState.Valid) {
                validRows++;
            }
        });
        return validRows;
    }

    addNewRow() {

        const newRow = {
            key: _.uniqueId(),
            status: PacketState.New,
            model: {
                pass: '',
                _id: '',
                lname: '',
                fname: '',
            },
            password: false,
            messages: [],
        };
        let accounts = this.state.accounts;
        accounts.push(newRow);
        this.setState({accounts});
    }

    switchSms() {
        this.setState({
            sendSms: !this.state.sendSms,
        });
    }

    render() {
        const validRows = this.validRowsCount();
        const modalFooter = (
            <div>
                <IcoN size={16} name={'gear16'}/>
                <label>
                    Send a login link to Phone Numbers via SMS ?
                </label>
                <Switch defaultChecked={this.state.sendSms} onChange={this.switchSms.bind(this)}/>
                <div className='filler'></div>
                <Button type=' butn butn-white' size='large' onClick={this.handleClose}>Discard</Button>
                <Button disabled={this.state.accounts.length === 0}
                    type=' butn butn-green' size='large' onClick={this.create.bind(this)}>
                        Create {this.state.accounts.length} Accounts
                </Button>
            </div>
        );
        return (
            <Modal
                visible={this.props.visible}
                title='Create Accounts'
                width={960}
                footer={modalFooter}
                className='create-accounts'
                afterClose={this.initModal.bind(this)}
                onCancel={this.handleClose}>
                <div>
                    <Row className='create-account-head'>
                        <Col span={5}><b>Phone Number</b></Col>
                        <Col span={5}><b>First Name</b></Col>
                        <Col span={5}><b>Last Name</b></Col>
                        <Col span={5}><b>Username</b></Col>
                        <Col span={4}><b>First Login Password</b></Col>
                    </Row>
                    {this.state.accounts.map((pocket) => (<InputRow
                        key={pocket.key}
                        onChange={this.handleChange}
                        onRemove={this.handleRemove}
                        ref={this.saveRowsReference.bind(this)}
                        account={pocket.model}
                        status={pocket.status}
                        refKey={pocket.key}/>))}
                    <Card>
                        <Row type='flex' align='middle'>
                            <a onClick={this.addNewRow.bind(this)}>
                                <Icon type='plus'/><b>Add more fields...</b>
                            </a>
                            <div className='filler'></div>
                            <input id='upload' type='file' accept='*.csv' onChange={this.readFile}
                                    onClick={(event) => {
                                        event.target.value = null;
                                    }} className='hidden'/>
                            <a type='primary' onClick={this.handleUpload}>
                                <b>Import from a file</b>
                            </a>
                            <span>
                                for download template &nbsp;
                                <a onClick={this.downloadListCSV.bind(this)} type='warning'>
                                    click here.
                                </a>
                            </span>
                            {/* <Col span={6}>
                                <a onClick={this.downloadExample}>
                                    Template example
                                </a>
                            </Col> */}
                        </Row>
                    </Card>
                </div>
            </Modal>
        );
    }

    private create() {
        this.validatePockets();
        if (this.validRowsCount() > this.state.accounts.length) {
            notification.error({
                message: 'Invalid Data',
                description: 'Please verify all accounts data is valid.',
            });
            return;
        }

        const accounts = this.state.accounts;
        let registerUser = (index: any) => {
            if (this.state.accounts[index].status !== PacketState.Pending) {
                if (index < this.state.accounts.length - 1) {
                    registerUser(index + 1);
                }
                return;
            }
            this.accountApi.register({
                uid: this.state.accounts[index].model._id,
                fname: this.state.accounts[index].model.fname,
                lname: this.state.accounts[index].model.lname,
                phone: this.state.accounts[index].model.phone,
                pass: this.state.accounts[index].model.pass !== ''? md5(this.state.accounts[index].model.pass): null,
            })
                .then((data) => {
                    console.log(data);
                    const account = this.state.accounts[index];
                    this.handleChange({
                        key: account.key,
                        model: account.model,
                        status: PacketState.Success
                    });
                })
                .then(() => {
                    if (this.state.accounts.length === index + 1) {
                        notification.success({
                            message: 'Job Done...',
                            description: 'User creation process finished successfully.',
                        });
                    }
                    if (index < this.state.accounts.length - 1) {
                        setTimeout(() => {
                            // registerUser(index + 1);
                        }, 500);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    const account = this.state.accounts[index];
                    this.handleChange({
                        key: account.key,
                        model: account.model,
                        status: PacketState.Failure
                    });
                });
        };


        setTimeout(() => {
            accounts.map((account, index) => {
                console.log(account);
                if (account.status === PacketState.Valid) {
                    this.handleChange({
                        key: account.key,
                        model: account.model,
                        status: PacketState.Pending,
                    });
                    registerUser(index);
                }
            });
        }, 200);


        // setTimeout(() => {
        //     registerUser(0);
        // }, 1000);

    }

    private downloadExample() {
        let data = [
            ['+989123456789', 'username1', 'First Name 1', 'Last Name 1', 'password1'],
            ['+989123456788', 'username2', 'First Name 2', 'Last Name 2', 'password2`']
        ];
        let csvContent = 'data:text/csv;charset=utf-8,';
        data.forEach(function (infoArray: Array<string>, index: any) {
            let dataString = infoArray.join(',');
            csvContent += index < data.length ? dataString + '\n' : dataString;
        });
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'create-account-example.csv');
        document.body.appendChild(link);
        link.click();
    }

    private downloadListCSV() {
        let data = [];

        [
            {model : {
                phone : '+989123456789',
                _id : 'username1',
                fname : 'First Name 1',
                lname : 'Last Name 1',
                pass : 'password1',
            }},
            {model : {
                phone : '+989123456788',
                _id : 'username2',
                fname : 'First Name 2',
                lname : 'Last Name 2',
                pass : 'password1',
            }},
        ].forEach((row) => {
            data.push([
                row.model.phone,
                row.model._id,
                row.model.fname,
                row.model.lname,
                row.model.pass
            ]);
        });

        let csvContent = 'data:text/csv;charset=utf-8,';
        data.forEach(function (infoArray: Array<string>, index: any) {
            let dataString = infoArray.join(',');
            csvContent += index < data.length ? dataString + '\n' : dataString;
        });
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'create-account-example.csv');
        document.body.appendChild(link);
        link.click();
    }

    private handleClose() {
        this.props.handleClose();
    }

    private import(text: string) {

        function makeid() {
            let text = '';
            let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }

        const CSV_ROW_ITEMS_COUNT = 5;
        const MAX_ITEMS_IN_FILE = 100;
        const DELAY_BETWEEN_IMPORT_ITEM = 0;
        const SKIP_LINE_START = '#';
        const NEW_LINE = '\n';

        if (!(_.isString(text) && text.length > 0)) {
            notification.warning({
                message: 'Attention',
                description: 'The file is empty!'
            });

            return;
        }

        const lines = _.split(text, NEW_LINE);
        const clearedText = _(lines).reject((line) => _.startsWith(line, SKIP_LINE_START)).value().join(NEW_LINE);
        const data = CSV.parse(clearedText);

        if (_.size(data) > MAX_ITEMS_IN_FILE) {
            notification.warning({
                message: 'Attention',
                description: 'There are more than 100 items in the file. Please sparate the items into smaller files.',
                duration: 8
            });

            return;
        }

        this.setState({accounts: []});
        this.rowsRefs = {};
        this.renderedRows = [];
        const packets = _(data)
            .filter((row) => (row.length === CSV_ROW_ITEMS_COUNT || row.length === CSV_ROW_ITEMS_COUNT - 1))
            .map((row) => {
                const packet: IPacket = {
                    key: _.uniqueId(),
                    status: PacketState.Filled,
                    model: {
                        phone: row[0],
                        _id: row[1],
                        fname: row[2],
                        lname: row[3],
                        pass: row[4] ? row[4] : makeid(),
                    },
                    messages: []
                };
                return packet;
            }).value();

        this.setState({
            accounts: packets,
        });

        this.renderRows();
        this.validatePockets();
        notification.success({
            message: 'Import',
            description: `All ${packets.length} account(s) have been imported successfully.`
        });
    }
}

export default Form.create()(Create);
