package sha256;

public class sha256 {
	//SHA256算法的8个哈希初值
	String H0="6a09e667";//16进制形式
	String H1="bb67ae85";
	String H2="3c6ef372";
	String H3="a54ff53a";
	String H4="510e527f";
	String H5="9b05688c";
	String H6="1f83d9ab";
	String H7="5be0cd19";
	String A,B,C,D,E,F,G,H;//二进制形式
	 
	//SHA256算法中用到的64个常量
	String[] k=new String[64];//二进制形式
	String[] K=//16进制形式
		{"428a2f98","71374491","b5c0fbcf","e9b5dba5","3956c25b","59f111f1","923f82a4","ab1c5ed5",
		"d807aa98","12835b01","243185be","550c7dc3","72be5d74","80deb1fe","9bdc06a7","c19bf174",
		"e49b69c1","efbe4786","0fc19dc6","240ca1cc","2de92c6f","4a7484aa","5cb0a9dc","76f988da",
		"983e5152","a831c66d","b00327c8","bf597fc7","c6e00bf3","d5a79147","06ca6351","14292967",
		"27b70a85","2e1b2138","4d2c6dfc","53380d13","650a7354","766a0abb","81c2c92e","92722c85",
		"a2bfe8a1","a81a664b","c24b8b70","c76c51a3","d192e819","d6990624","f40e3585","106aa070",
		"19a4c116","1e376c08","2748774c","34b0bcb5","391c0cb3","4ed8aa4a","5b9cca4f","682e6ff3",
		"748f82ee","78a5636f","84c87814","8cc70208","90befffa","a4506ceb","bef9a3f7","c67178f2"};

	int chunk=1;//将消息分解成512-bit大小的块数
	String bimsg=new String();//原始信息的二进制编码
	//SHA256算法中的最小运算单元称为“字”（Word），一个字是32位
	String [] w=new String[64];
	
	//获得结果
	public String getSHA()
	{
		String rst = H0+H1+H2+H3+H4+H5+H6+H7;
		return rst.toUpperCase();
	}
	
	//SHA256算法实现
	public sha256(String text) {
		for(int i=0;i<64;i++) {
			k[i]=hexToBi(K[i]);
		}
		//SHA256算法中的预处理就是在想要Hash的消息后面补充需要的信息，使整个消息满足指定的结构
		//获得原始信息的二进制编码
		bimsg=stringToBinary(text);
		//附加长度值
		int LENGTH=bimsg.length();
		//计算信息预处理后512-bit大小的块数
		//长度小于448，填充到448，最后会有1个512-bit大小的块
		if(LENGTH<448)
			chunk=1;
		//长度大于等于448小于等于512，填充到512+448，最后会有2个512-bit大小的块
		else if(LENGTH>=448&&LENGTH<=512)
			chunk=2;
		//长度大于512
		else {
			if(LENGTH%512<448)//对512取模后余数<448
				chunk=LENGTH/512+1;
			else//对512取模后余数>=448
				chunk=LENGTH/512+2;
		}
		//字符数组的形式便于填充比特
		char[] ca = new char[512*chunk];
		for(int i=0;i<LENGTH;i++) {
			ca[i]=bimsg.charAt(i);
		}
		//信息预处理
		//原始数据的长度信息
		String lengthinfo=new String(Integer.toBinaryString(LENGTH));
		//先补第一个比特为1，然后都补0，直到长度满足对512取模后余数是448
		ca[LENGTH]='1';
		for(int i=LENGTH+1;i<512*chunk-lengthinfo.length();i++) {
			ca[i]='0';
		}
		//将原始数据的长度信息补到已经进行了填充操作的消息后面
		for(int i=512*chunk-lengthinfo.length();i<512*chunk;i++) {
			ca[i]=lengthinfo.charAt(i-512*chunk+lengthinfo.length());
		}
		//填充后二进制信息字符串
		String msg = new String(ca);
		
		//迭代算法
		for(int n=0; n<chunk; n++){
			String tmp=new String();//临时存储每个块信息
			tmp=msg.substring(n*512,(n+1)*512);//每个块512-bit大小
			//STEP1：构造64个字（word）
			//前16个字直接由消息的第i个块分解得到
			for(int i=0;i<16;i++) 
			{
				w[i]=tmp.substring(i*32,(i+1)*32);
			}
			//其余的字由如下迭代公式得到：W[i]=σ1(W[i−2])+W[i−7]+σ0(W[i−15])+W[i−16]
			for(int i=16;i<64;i++) 
			{
				w[i]=Add(Add(sigma1(w[i-2]),w[i-7]),Add(sigma0(w[i-15]),w[i-16]));
			}
			A=new String(hexToBi(H0));
			B=new String(hexToBi(H1));
			C=new String(hexToBi(H2));
			D=new String(hexToBi(H3));
			E=new String(hexToBi(H4));
			F=new String(hexToBi(H5));
			G=new String(hexToBi(H6));
			H=new String(hexToBi(H7));
			//STEP2：进行64次循环
			SHA_256(A,B,C,D,E,F,G,H);
		}
	}
	
	//获得原始信息的二进制编码
	public String stringToBinary(String str) {
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<str.length();i++) {
			sb=sb.append(ASCII(Integer.toBinaryString(Integer.valueOf(str.charAt(i)))));
		}
		return sb.toString();
	}
	//用0补全8位ascii码
	public String ASCII(String str) {
		String rst=new String();
		StringBuffer sb=new StringBuffer();
		if(str.length()<8)
			for(int i=0;i<8-str.length();i++) {
			rst=sb.append('0').toString();
		}
		return rst+str;
	}
	
	//STEP2：进行64次循环
	public void SHA_256(String A,String B,String C,String D,String E,String F,String G,String H) {
		String t1=new String();
		String t2=new String();
		for(int i=0;i<64;i++) {
			t1=Add(Add(Add(H,SIGMA1(E)),Add(ch(E,F,G),k[i])),w[i]);
			t2=Add(SIGMA0(A),ma(A,B,C));
			H=G;
			G=F;
			F=E;
			E=Add(D,t1);
			D=C;
			C=B;
			B=A;
			A=Add(t1,t2);
		}
		H0=biToHex(Add(A,hexToBi(H0)));
		H1=biToHex(Add(B,hexToBi(H1)));
		H2=biToHex(Add(C,hexToBi(H2)));
		H3=biToHex(Add(D,hexToBi(H3)));
		H4=biToHex(Add(E,hexToBi(H4)));
		H5=biToHex(Add(F,hexToBi(H5)));
		H6=biToHex(Add(G,hexToBi(H6)));
		H7=biToHex(Add(H,hexToBi(H7)));
	}
	
	//SHA256散列函数中涉及的操作全部是逻辑的位运算
	//包括如下的逻辑函数：
	//按位“异或”
	public String xor(String x,String y) {
		String str=new String();
		StringBuffer s=new StringBuffer();
		for(int i=0;i<x.length();i++) {
			if(x.charAt(i)==y.charAt(i))
				str=s.append('0').toString();
			else
				str=s.append('1').toString();
		}
		return str;
	}
	//按位“与”
	public String and(String x,String y) {
		String rst=new String();
		StringBuffer s=new StringBuffer();
		for(int i=0; i<x.length(); i++) {
			if(x.charAt(i)=='0'||y.charAt(i)=='0')
				rst=s.append('0').toString();
			else
				rst=s.append('1').toString();
		}
		return rst;
	}
	//按位“或”
	public String or(String x,String y) {
		String rst=new String();
		StringBuffer s=new StringBuffer();
		for(int i=0; i<x.length(); i++) {
			if(x.charAt(i)=='1'||y.charAt(i)=='1')
				rst=s.append('1').toString();
			else
				rst=s.append('0').toString();
		}
		return rst;
	}
	//按位“非”（补）
	public String not(String x) {
		String rst=new String();
		StringBuffer s=new StringBuffer();
		for(int i=0; i<x.length(); i++) {
			if(x.charAt(i)=='0')
				rst=s.append('1').toString();
			else
				rst=s.append('0').toString();
		}
		return rst;
	}
	//循环右移n个bit
	public String rotr(String str,int n) {
		return str.substring(str.length()-n)+str.substring(0,str.length()-n);
	}
	//右移n个bit
	public String shr(String str,int n) {
		char[] left0 = new char[n];
		for(int i =0; i<left0.length; i++)
			left0[i] = '0';
		String left=str.substring(0,str.length()-n);
		return new String(left0)+left;
	}
	//Ch(x,y,z)
	public String ch(String x,String y,String z) {
		return xor(and(x,y),and(not(x),z));
	}
	//Ma(x,y,z)
	public String ma(String x,String y,String z) {
		return xor(xor(and(x,y),and(x,z)),and(y,z));
	}
	//σ0(x)
	public String sigma0(String x) {
		return xor(xor(rotr(x,7),rotr(x,18)),shr(x,3));
	}
	//σ1(x)
	public String sigma1(String x) {
		return xor(xor(rotr(x,17),rotr(x,19)),shr(x,10));
	}
	//Σ0(x)
	public String SIGMA0(String x) {
		return xor(xor(rotr(x,2),rotr(x,13)),rotr(x,22));
	}
	//Σ1(x)
	public String SIGMA1(String x) {
		return xor(xor(rotr(x,6),rotr(x,11)),rotr(x,25));
	}
	//2个32-bit的的字的加法
	public String Add(String x,String y) {
		char[] rst=new char[32];
		int flag=0;
		for(int i=x.length()-1;i>=0;i--) {
			rst[i]=(char)(((x.charAt(i)-'0')+((y.charAt(i)-'0'))+flag)%2+'0');
			if(((x.charAt(i)-'0')+(y.charAt(i)-'0')+flag)>=2)
				flag=1;
			else
				flag=0;
		}
		return new String(rst);
	}
	//2进制字符串转换为16进制字符串
	public String biToHex(String str) {
		int value=0;
		StringBuffer rst=new StringBuffer();
		for(int i=0; i<str.length()/4; i++) {
			value=Integer.valueOf(str.substring(i*4,(i+1)*4),2);
			rst=rst.append(Integer.toHexString(value));
		}
		return rst.toString();
	}
	//16进制字符串转换为2进制字符串
	public String hexToBi(String str) {
		String rst = "";
		String bi = "";
		for(int i=0;i<str.length();i++){
			switch(str.charAt(i)) {
				case '0':bi="0000";break;
				case '1':bi="0001";break;
				case '2':bi="0010";break;
				case '3':bi="0011";break;
				case '4':bi="0100";break;
				case '5':bi="0101";break;
				case '6':bi="0110";break;
				case '7':bi="0111";break;
				case '8':bi="1000";break;
				case '9':bi="1001";break;
				case 'a':bi="1010";break;
				case 'b':bi="1011";break;
				case 'c':bi="1100";break;
				case 'd':bi="1101";break;
				case 'e':bi="1110";break;
				case 'f':bi="1111";break;
				}
			rst += bi;
		}
		return rst.toString();
	}
}